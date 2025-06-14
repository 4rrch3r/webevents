import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { NatsHealthIndicator } from './nats.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private nats: NatsHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.nats.isHealthy('nats')]);
  }
}
