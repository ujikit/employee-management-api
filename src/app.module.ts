import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import * as path from 'path';
import { ApplicationsModule } from './applications/applications.module';
import { CommonsModule } from './commons/commons.module';
import { OptionalAuthGuard } from './commons/v1/jwt/roles.guard';
import {
  logger,
  redact,
  responseBodyPreview,
} from './commons/v1/logging/logger';
import { EmailService } from './commons/v1/mail/service/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: process.env.ENVIRONMENT === "development" ? false : true, // Requires valid SSL certificate from TiDB
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        logger,
        autoLogging: process.env.HTTP_LOGGING === 'true' && {
          ignore: (req) => !String(req.url ?? '').startsWith('/api/v1'),
        },
        genReqId: (req) =>
          (req as { traceId?: string }).traceId ?? randomUUID(),
        customLogLevel: (req, res, err) =>
          err || res.statusCode >= 500
            ? 'error'
            : res.statusCode >= 400
              ? 'warn'
              : 'info',
        customProps: (req) => {
          const r = req as unknown as {
            traceId?: string;
            user?: { id?: number };
            body?: unknown;
            _propsBound?: boolean;
          };
          if (!r._propsBound) {
            r._propsBound = true;
            return {};
          }
          return {
            event: 'response',
            trace_id: r.traceId,
            user_id: r.user?.id ?? null,
            body: redact(r.body),
          };
        },
        serializers: {
          req: (req) => ({ method: req.method, url: req.url }),
          res: (res) => ({
            statusCode: res.statusCode,
            body: responseBodyPreview(
              res.statusCode,
              (res as { payload?: unknown }).payload,
            ),
          }),
        },
      },
    }),
    CommonsModule,
    ApplicationsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get<string>('REDIS_PORT', '6379')),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          db: Number(config.get<string>('REDIS_DB', '0')),
        },
      }),
    }),
    // Only mount BullBoard dashboard if not running on Vercel Serverless
    ...(process.env.VERCEL
      ? []
      : [
        BullBoardModule.forRoot({
          route: '/queues',
          adapter: ExpressAdapter,
        }),
      ]),
    I18nModule.forRoot({
      fallbackLanguage: 'zh',
      loaderOptions: {
        path: path.join(__dirname, 'commons/i18n/'),
        watch: false,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: Number(config.get<string>('MAIL_PORT')),
          secure: process.env.ENVIRONMENT === "development" ? false : true,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
          tls: {
            rejectUnauthorized: process.env.ENVIRONMENT === "development" ? false : true, // Prevents certificate verification errors for SMTP
          },
        },
        defaults: {
          from: config.get<string>(
            'MAIL_FROM',
            '"Employee Management" <no-reply@example.com>',
          ),
        },
      }),
    }),
  ],
  providers: [OptionalAuthGuard, EmailService],
  exports: [EmailService],
})
export class AppModule { }