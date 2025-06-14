import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { NatsHealthIndicator } from './nats.health';
import { NatsWrapperModule } from '@app/nats-wrapper';

@Module({
  imports: [TerminusModule, NatsWrapperModule],
  controllers: [HealthController],
  providers: [NatsHealthIndicator],
})
export class HealthModule {}
