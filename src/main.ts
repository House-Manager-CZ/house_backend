import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('etag', 'strong');

  app.use(cookieParser());
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
