import { Module } from '@nestjs/common';
import { ReporterController } from './reporter.controller';
import { ReporterService } from './reporter.service';
import { PrismaModule } from '@app/prisma';
import { ReporterMetricsService } from './metrics/reporter.metrics.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, HealthModule],
  controllers: [ReporterController],
  providers: [ReporterService, ReporterMetricsService],
})
export class ReporterModule {}
