import { Injectable } from '@nestjs/common';
import { Histogram, Counter, Registry } from 'prom-client';

@Injectable()
export class ReporterMetricsService {
  private readonly registry = new Registry();
  private readonly requestDurationHistogram: Histogram<string>;
  private readonly requestCounter: Counter<string>;
  private readonly errorCounter: Counter<string>;

  constructor() {
    // Create metrics
    this.requestDurationHistogram = new Histogram({
      name: 'reporter_request_duration_seconds',
      help: 'Duration of reporter service requests in seconds',
      labelNames: ['category', 'success'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // Define your buckets
      registers: [this.registry],
    });

    this.requestCounter = new Counter({
      name: 'reporter_request_count',
      help: 'Total number of reporter service requests',
      labelNames: ['category'],
      registers: [this.registry],
    });

    this.errorCounter = new Counter({
      name: 'reporter_error_count',
      help: 'Total number of reporter service errors',
      labelNames: ['category'],
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
