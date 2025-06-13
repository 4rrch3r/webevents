import { Injectable } from '@nestjs/common';
import { Histogram, Counter, Registry } from 'prom-client';
import { METRIC_HELP, METRIC_LABELS, METRIC_NAMES } from '../utils';

@Injectable()
export class ReporterMetricsService {
  private readonly registry = new Registry();
  private readonly requestDurationHistogram: Histogram<string>;
  private readonly requestCounter: Counter<string>;
  private readonly errorCounter: Counter<string>;

  constructor() {
    this.requestDurationHistogram = new Histogram({
      name: METRIC_NAMES.REQUEST_DURATION,
      help: METRIC_HELP.REQUEST_DURATION,
      labelNames: METRIC_LABELS.DURATION,
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.registry],
    });

    this.requestCounter = new Counter({
      name: METRIC_NAMES.REQUEST_COUNT,
      help: METRIC_HELP.REQUEST_COUNT,
      labelNames: METRIC_LABELS.COUNT,
      registers: [this.registry],
    });

    this.errorCounter = new Counter({
      name: METRIC_NAMES.ERROR_COUNT,
      help: METRIC_HELP.ERROR_COUNT,
      labelNames: METRIC_LABELS.COUNT,
      registers: [this.registry],
    });
  }

  public async trackLatency<T>(
    category: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const endTimer = this.requestDurationHistogram.startTimer({ category });
    this.requestCounter.inc({ category });

    try {
      const result = await fn();
      endTimer({ success: 'true' });
      return result;
    } catch (error) {
      this.errorCounter.inc({ category });
      endTimer({ success: 'false' });
      throw error;
    }
  }

  public getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
  getContentType() {
    return this.registry.contentType;
  }
}
