import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { json, urlencoded } from 'express';
import { APP_DEFAULT_PORT, REQUEST_LIMIT } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {});

  app.use(json({ limit: REQUEST_LIMIT }));
  app.use(urlencoded({ extended: true, limit: REQUEST_LIMIT }));
  await app.listen(process.env.GATEWAY_PORT ?? APP_DEFAULT_PORT);
}
bootstrap();
