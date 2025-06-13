import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';
import {
  DEFAULT_METRICS_PREFIX,
  FB_COLLECTOR_METRICS_HELP_TEXT,
  FbCollectorMetricLabels,
  FbCollectorMetricNames,
} from '../utils';

@Injectable()
export class FbCollectorMetricsService {
  public readonly registry = new client.Registry();

  public readonly acceptedEvents = new client.Counter({
    name: FbCollectorMetricNames.ACCEPTED_EVENTS,
    help: FB_COLLECTOR_METRICS_HELP_TEXT.ACCEPTED_EVENTS,
    labelNames: [FbCollectorMetricLabels.SOURCE],
    registers: [this.registry],
  });

  public readonly processedEvents = new client.Counter({
    name: FbCollectorMetricNames.PROCESSED_EVENTS,
    help: FB_COLLECTOR_METRICS_HELP_TEXT.PROCESSED_EVENTS,
    labelNames: [FbCollectorMetricLabels.QUANTITY],
    registers: [this.registry],
  });

  public readonly failedEvents = new client.Counter({
    name: FbCollectorMetricNames.FAILED_EVENTS,
    help: FB_COLLECTOR_METRICS_HELP_TEXT.FAILED_EVENTS,
    labelNames: [FbCollectorMetricLabels.QUANTITY],
    registers: [this.registry],
  });

  constructor() {
    client.collectDefaultMetrics({
      register: this.registry,
      prefix: DEFAULT_METRICS_PREFIX,
    });
  }

  incAcceptedEvents(count: number = 1) {
    this.acceptedEvents.inc(count);
  }

  incProcessedEvents(count: number = 1) {
    this.processedEvents.inc(count);
  }

  incFailedEvents(count: number = 1) {
    this.failedEvents.inc(count);
  }

  async getMetrics() {
    return this.registry.metrics();
  }

  getContentType() {
    return this.registry.contentType;
  }
}
