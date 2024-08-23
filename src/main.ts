import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  const serverUrl = await app.getUrl();

  const url = serverUrl.replace('[::1]', 'localhost');

  Logger.log(`🚀 Server is running on: ${url}`, 'API');
}
bootstrap();
