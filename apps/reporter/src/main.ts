import { NestFactory } from '@nestjs/core';
import { ReporterModule } from './reporter.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ReporterModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.port ?? 3003);
}
bootstrap();
