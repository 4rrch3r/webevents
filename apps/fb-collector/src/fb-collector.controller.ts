import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FbCollectorMetricsService } from './metrics/fb-collector.metrics.service';

@Controller()
export class FbCollectorController {
  constructor(
    private readonly fbCollectorMetricsService: FbCollectorMetricsService,
  ) {}

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    try {
      res.set('Content-Type', this.fbCollectorMetricsService.getContentType());
      const metrics = await this.fbCollectorMetricsService.getMetrics();
      res.send(metrics);
    } catch (err) {
      res.status(500).send('Error generating metrics');
    }
  }
}
