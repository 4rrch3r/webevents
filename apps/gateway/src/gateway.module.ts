import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { NatsWrapperModule } from '@app/nats-wrapper';
import { GatewayMetricsService } from './metrics/gateway.metrics.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [NatsWrapperModule, HealthModule],
  controllers: [GatewayController],
  providers: [GatewayMetricsService],
})
export class GatewayModule {}
