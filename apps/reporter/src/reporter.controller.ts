import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { RevenueReportDto } from './dto/revenue.report';
import { DemographyReportDto } from './dto/demography.report';
import { ReporterMetricsService } from './metrics/reporter.metrics.service';
import { Response } from 'express';
@Controller()
export class ReporterController {
  constructor(
    private readonly reporterService: ReporterService,
    private readonly reporterMetricsService: ReporterMetricsService,
  ) {}

  @Get('reports/revenue')
  async getRevenueReport(@Query() params: RevenueReportDto) {
    return this.reporterService.generateRevenueReport(params);
  }

  @Get('reports/demographics')
  async getDemographicsReport(@Query() params: DemographyReportDto) {
    return this.reporterService.generateDemographicsReport(params);
  }

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    try {
      res.set('Content-Type', this.reporterMetricsService.getContentType());
      const metrics = await this.reporterMetricsService.getMetrics();
      res.send(metrics);
    } catch (err) {
      res.status(500).send('Error generating metrics');
    }
  }
}
