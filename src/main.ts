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
import { setupSwagger } from './commons/v1/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Route Nest's own Logger through Pino
  app.useLogger(app.get(PinoNestLogger));

  app.enableCors();

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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 Swagger documentation available at: http://localhost:${port}/docs`);
}

// Prevent unhandled rejections from crashing process
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION - caught at process level]', reason);
});

bootstrap();