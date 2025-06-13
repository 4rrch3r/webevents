import { Module } from '@nestjs/common';
import { ReporterController } from './reporter.controller';
import { ReporterService } from './reporter.service';
import { PrismaModule } from '@app/prisma';
import { ReporterMetricsService } from './metrics/reporter.metrics.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReporterController],
  providers: [ReporterService, ReporterMetricsService],
})
export class ReporterModule {}
