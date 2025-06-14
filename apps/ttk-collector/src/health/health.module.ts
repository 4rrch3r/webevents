import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaModule } from '@app/prisma';
import { NatsWrapperModule } from '@app/nats-wrapper';
import { NatsHealthIndicator } from './nats.health';

@Module({
  imports: [TerminusModule, PrismaModule, NatsWrapperModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, NatsHealthIndicator],
})
export class HealthModule {}
