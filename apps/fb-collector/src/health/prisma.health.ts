import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { PrismaService } from '@app/prisma';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return indicator.up();
    } catch (e) {
      return indicator.down();
    }
  }
}
