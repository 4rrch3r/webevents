import { Controller, Get, Query, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReporterService } from './reporter.service';
import { RevenueReportDto } from './dto/revenue.report';
import { DemographyReportDto } from './dto/demography.report';
import { ReporterMetricsService } from './metrics/reporter.metrics.service';
import { Response } from 'express';
import {
  DemographicResponseBadRequestDto,
  DemographicResponseOkDto,
  RevenueResponseBadRequestDto,
  RevenueResponseOkDto,
} from './dto/responses';

@ApiTags('Reports')
@Controller()
export class ReporterController {
  constructor(
    private readonly reporterService: ReporterService,
    private readonly reporterMetricsService: ReporterMetricsService,
  ) {}

  @Get('reports/revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiOkResponse({
    type: RevenueResponseOkDto,
  })
  @ApiBadRequestResponse({
    type: RevenueResponseBadRequestDto,
  })
  async getRevenueReport(@Query() params: RevenueReportDto) {
    return this.reporterService.generateRevenueReport(params);
  }

  @Get('reports/demographics')
  @ApiOperation({ summary: 'Get demographics report' })
  @ApiOkResponse({
    type: DemographicResponseOkDto,
  })
  @ApiBadRequestResponse({
    type: DemographicResponseBadRequestDto,
  })
  async getDemographicsReport(@Query() params: DemographyReportDto) {
    return this.reporterService.generateDemographicsReport(params);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiOkResponse({
    description: 'Metrics response in Prometheus format',
  })
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
