import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { useContainer } from 'class-validator';
import express from 'express';
import 'mysql2';
import { Logger as PinoNestLogger } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AppModule } from './app.module';
import { BigIntInterceptor } from './commons/v1/interceptors/big-int.interceptor';
import { MergeParamAndBodyInterceptor } from './commons/v1/interceptors/merge-param-body.interceptor';
import { instrumentFunctionLogging } from './commons/v1/logging/function-logging';
import { traceContext } from './commons/v1/logging/trace-context';
import { setupSwagger } from './commons/v1/swagger/swagger';

const expressApp = express();

export const createServer = async () => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { bufferLogs: true },
  );

  // Route Nest's own Logger through Pino
  app.useLogger(app.get(PinoNestLogger));

  // Replace simple app.enableCors() with this:
  app.enableCors({
    origin: [
      'https://employee-management-web-eight.vercel.app',
      'http://localhost:3001', // For local dev
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Trace Context for /api/v1 requests
  app.use((req, res, next) => {
    if (String(req.url ?? '').startsWith('/api/v1')) {
      req.traceId = randomUUID();
      traceContext.run({ traceId: req.traceId }, next);
    } else {
      next();
    }
  });

  // Instrument function logging if enabled
  if (process.env.FUNCTION_LOGGING === 'true') {
    instrumentFunctionLogging(app);
  }

  // Body Parser Limits
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Global Route Prefix & Versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // Setup Swagger Documentation at /docs
  setupSwagger(app);

  // Global Interceptors
  app.useGlobalInterceptors(new BigIntInterceptor());
  app.useGlobalInterceptors(new MergeParamAndBodyInterceptor());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Class Validator Container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.init();
  return expressApp;
};

// 1. Vercel Serverless Handler (Exported for Vercel functions)
let cachedServer: any;

export default async function handler(req: any, res: any) {
  const allowedOrigins = [
    'https://employee-management-web-eight.vercel.app',
    'http://localhost:3001',
  ];

  const origin = req.headers.origin;

  // Always set CORS headers on EVERY response (even errors)
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://employee-management-web-eight.vercel.app');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');

  // Handle preflight OPTIONS instantly
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!cachedServer) {
      cachedServer = await createServer();
    }
    return await cachedServer(req, res);
  } catch (error: any) {
    console.error('SERVER CRASH IN HANDLER:', error);
    // Explicitly return JSON with CORS headers intact
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error?.message || String(error),
    });
  }
}

// 2. Local Development Fallback
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  createServer().then((server) => {
    server.listen(port, () => {
      console.log(`🚀 Application is running on: http://localhost:${port}`);
      console.log(`📄 Swagger documentation available at: http://localhost:${port}/docs`);
    });
  });
}

// Prevent unhandled rejections from crashing process
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION - caught at process level]', reason);
});