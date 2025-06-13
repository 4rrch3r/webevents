import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { NatsWrapperModule } from '@app/nats-wrapper';
import { GatewayMetricsService } from './metrics/gateway.metrics.service';

@Module({
  imports: [NatsWrapperModule],
  controllers: [GatewayController],
  providers: [GatewayMetricsService],
})
export class GatewayModule {}
