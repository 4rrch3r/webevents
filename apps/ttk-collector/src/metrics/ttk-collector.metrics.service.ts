import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';
import {
  DEFAULT_METRICS_PREFIX,
  TtkMetricHelp,
  TtkMetricLabels,
  TtkMetricNames,
} from '../utils';

@Injectable()
export class TtkCollectorMetricsService {
  public readonly registry = new client.Registry();

  public readonly acceptedEvents = new client.Counter({
    name: TtkMetricNames.AcceptedEvents,
    help: TtkMetricHelp.AcceptedEvents,
    labelNames: [TtkMetricLabels.Source],
    registers: [this.registry],
  });

  public readonly processedEvents = new client.Counter({
    name: TtkMetricNames.ProcessedEvents,
    help: TtkMetricHelp.ProcessedEvents,
    labelNames: [TtkMetricLabels.Quantity],
    registers: [this.registry],
  });

  public readonly failedEvents = new client.Counter({
    name: TtkMetricNames.FailedEvents,
    help: TtkMetricHelp.FailedEvents,
    labelNames: [TtkMetricLabels.Quantity],
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
