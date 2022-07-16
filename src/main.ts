import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from 'dotenv';
import * as Sentry from '@sentry/node';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  const docConfig = new DocumentBuilder()
    .setTitle('House Manager API')
    .setDescription("House Manager API's description")
    .setVersion(process.env.npm_package_version)
    .addCookieAuth('Authentication', {
      name: 'Authentication',
      type: 'apiKey',
    })
    .build();

  const doc = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api', app, doc);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({
        tracing: true,
      }),
    ],
  });

  app.set('etag', 'strong');

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
  app.use(cookieParser());
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
