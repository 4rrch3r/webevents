import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { TtkCollectorMetricsService } from './metrics/ttk-collector.metrics.service';

@Controller()
export class TtkCollectorController {
  constructor(
    private readonly ttkCollectorMetricsService: TtkCollectorMetricsService,
  ) {}

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    try {
      res.set('Content-Type', this.ttkCollectorMetricsService.getContentType());
      const metrics = await this.ttkCollectorMetricsService.getMetrics();
      res.send(metrics);
    } catch (err) {
      res.status(500).send('Error generating metrics');
    }
  }
}
