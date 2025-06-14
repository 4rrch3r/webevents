import { Module } from '@nestjs/common';
import { FbCollectorController } from './fb-collector.controller';
import { FbCollectorService } from './fb-collector.service';
import { NatsWrapperModule } from '@app/nats-wrapper';
import { FbCollectorValidationService } from './validation/fb-collector.validation.service';
import { PrismaModule } from '@app/prisma';
import { FbCollectorDataService } from './data/fb-collector.data.service';
import { FbCollectorMetricsService } from './metrics/fb-collector.metrics.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [NatsWrapperModule, PrismaModule, HealthModule],
  controllers: [FbCollectorController],
  providers: [
    FbCollectorService,
    FbCollectorValidationService,
    FbCollectorDataService,
    FbCollectorMetricsService,
  ],
})
export class FbCollectorModule {}
