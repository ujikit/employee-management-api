import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { useContainer } from 'class-validator';
import { Logger as PinoNestLogger } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AppModule } from './app.module';
import { BigIntInterceptor } from './commons/v1/interceptors/big-int.interceptor';
import { MergeParamAndBodyInterceptor } from './commons/v1/interceptors/merge-param-body.interceptor';
import { instrumentFunctionLogging } from './commons/v1/logging/function-logging';
import { traceContext } from './commons/v1/logging/trace-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // Route Nest's own Logger (framework + `new Logger()` in services) through
  // the shared async pino instance.
  app.useLogger(app.get(PinoNestLogger));

  app.enableCors();
  // Opens the trace context for every /api/v1 request: generates the
  // traceId (exposed as root-level traceId, logged as trace_id) and makes it
  // reachable from any function via AsyncLocalStorage.
  app.use((req, res, next) => {
    if (String(req.url ?? '').startsWith('/api/v1')) {
      req.traceId = randomUUID();
      traceContext.run({ traceId: req.traceId }, next);
    } else {
      next();
    }
  });
  // Wraps all DI provider methods to log input/output/duration per call
  // (only active inside a trace context, i.e. /api/v1 requests).
  if (process.env.FUNCTION_LOGGING === 'true') {
    instrumentFunctionLogging(app);
  }
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  app.useGlobalInterceptors(new BigIntInterceptor());

  app.useGlobalInterceptors(new MergeParamAndBodyInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}

// Prevent unhandled rejections (e.g. from Puppeteer ErrorEvent) from crashing the process
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION - caught at process level]', reason);
});

bootstrap();
