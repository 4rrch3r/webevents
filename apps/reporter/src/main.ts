import { NestFactory } from '@nestjs/core';
import { ReporterModule } from './reporter.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ReporterModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Reporter API')
    .setDescription('Reporting endpoints for revenue and demographics')
    .setVersion('1.0')
    .addTag('Reports')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.port ?? 3003);
}
bootstrap();
