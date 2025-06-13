import { NestFactory } from '@nestjs/core';
import { FbCollectorModule } from './fb-collector.module';
import { APP_DEFAULT_PORT } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(FbCollectorModule);
  await app.listen(process.env.FB_COLLECTOR_PORT ?? APP_DEFAULT_PORT);
}
bootstrap();
