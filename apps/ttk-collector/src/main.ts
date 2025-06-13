import { NestFactory } from '@nestjs/core';
import { TtkCollectorModule } from './ttk-collector.module';
import { APP_DEFAULT_PORT } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(TtkCollectorModule);
  await app.listen(process.env.TTK_COLLECTOR_PORT ?? APP_DEFAULT_PORT);
}
bootstrap();
