import { Module } from '@nestjs/common';
import { TtkCollectorController } from './ttk-collector.controller';
import { TtkCollectorService } from './ttk-collector.service';
import { NatsWrapperModule } from '@app/nats-wrapper';
import { PrismaModule } from '@app/prisma';
import { TtkCollectorValidationService } from './validation/ttk-collector.validation.service';
import { TtkCollectorDataService } from './data/ttk-collector.data.service';
import { TtkCollectorMetricsService } from './metrics/ttk-collector.metrics.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [NatsWrapperModule, PrismaModule, HealthModule],
  controllers: [TtkCollectorController],
  providers: [
    TtkCollectorService,
    TtkCollectorValidationService,
    TtkCollectorDataService,
    TtkCollectorMetricsService,
  ],
})
export class TtkCollectorModule {}
