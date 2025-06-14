import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { NatsWrapperService } from '@app/nats-wrapper';

@Injectable()
export class NatsHealthIndicator {
  constructor(
    private readonly nats: NatsWrapperService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      const isConnected = await this.nats.isConnected();
      return isConnected ? indicator.up() : indicator.down();
    } catch (e) {
      return indicator.down();
    }
  }
}
