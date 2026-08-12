import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot(),
    // One JSON line per /api/v1 request on completion (method, url, status,
    // responseTime, redacted body), written asynchronously via the shared
    // pino instance. Replaces the old HttpLoggingInterceptor, whose
    // synchronous console.log of full payloads was adding ~2s per request.
    // Response bodies are no longer logged — correlate via trace_id and read
    // the function/error lines instead.
    LoggerModule.forRoot({
      pinoHttp: {
        logger,
        autoLogging: process.env.HTTP_LOGGING === 'true' && {
          ignore: (req) => !String(req.url ?? '').startsWith('/api/v1'),
        },
        // Reuse the traceId set by the /api/v1 middleware in main.ts so the
        // HTTP line, function lines, and the client-visible traceId match.
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
          // pino-http calls this twice: at request start (bound into the
          // child logger, before body-parsing/auth) and at response finish.
          // Binding on the first call duplicated every key in the line with
          // stale values — skip it and emit only on the finish call.
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
          // `payload` is the response envelope stashed by ResponseInterceptor;
          // 4xx/5xx bodies always logged, 2xx only when small (see helper).
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
          host: config.get<string>('REDIS_HOST') ?? 'localhost',
          port: Number(config.get<string>('REDIS_PORT') ?? '6379'),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          db: Number(config.get<string>('REDIS_DB') ?? '0'),
        },
      }),
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'zh',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'commons'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'fauzizaki15@gmail.com',
          pass: 'hiok dtop lgij omuz',
        },
        // logger: true,
        // debug: true,
      },
      defaults: {
        from: '"Employee Management" <baba@gmail.com>',
      },
    }),
  ],
  providers: [
    OptionalAuthGuard,
    EmailService,
  ],
  exports: [EmailService],
})
export class AppModule { }
