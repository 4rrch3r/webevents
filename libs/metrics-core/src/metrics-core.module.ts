import { Module } from '@nestjs/common';
import { MetricsCoreService } from './metrics-core.service';

@Module({
  providers: [MetricsCoreService],
  exports: [MetricsCoreService],
})
export class MetricsCoreModule {}
