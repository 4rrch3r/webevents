import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';
import {
  DEFAULT_METRICS_PREFIX,
  GATEWAY_METRICS_HELP_TEXT,
  GatewayMetricLabels,
  GatewayMetricNames,
} from '../utils';

@Injectable()
export class GatewayMetricsService {
  public readonly registry = new client.Registry();

  public readonly acceptedEvents = new client.Counter({
    name: GatewayMetricNames.ACCEPTED_EVENTS,
    help: GATEWAY_METRICS_HELP_TEXT.ACCEPTED_EVENTS,
    labelNames: [GatewayMetricLabels.SOURCE],
    registers: [this.registry],
  });

  public readonly processedEvents = new client.Counter({
    name: GatewayMetricNames.PROCESSED_EVENTS,
    help: GATEWAY_METRICS_HELP_TEXT.PROCESSED_EVENTS,
    labelNames: [GatewayMetricLabels.TYPE],
    registers: [this.registry],
  });

  public readonly failedEvents = new client.Counter({
    name: GatewayMetricNames.FAILED_EVENTS,
    help: GATEWAY_METRICS_HELP_TEXT.FAILED_EVENTS,
    labelNames: [GatewayMetricLabels.TYPE],
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
// @Injectable()
// export class GatewayMetricsService {
//   constructor(
//     @InjectMetric('gateway_accepted_events')
//     private readonly acceptedEvents: Counter,
//   ) {}

//   incAcceptedEvents(count: number = 1) {
//     this.acceptedEvents.inc(count);
//   }
// }
// apps/gateway/src/metrics/gateway-metrics.service.ts

// src/metrics/gateway.metrics.service.ts
