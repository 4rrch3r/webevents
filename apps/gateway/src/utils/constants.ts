export const APP_DEFAULT_PORT = 3000;
export const REQUEST_LIMIT = '50mb';
export const DEFAULT_METRICS_PREFIX = 'gateway_';

export enum GatewayMetricNames {
  ACCEPTED_EVENTS = 'gateway_accepted_events_total',
  PROCESSED_EVENTS = 'gateway_processed_events_total',
  FAILED_EVENTS = 'gateway_failed_events_total',
}

export enum GatewayMetricLabels {
  SOURCE = 'source',
  TYPE = 'type',
}

export const GATEWAY_METRICS_HELP_TEXT = {
  ACCEPTED_EVENTS: 'Total events accepted by gateway',
  PROCESSED_EVENTS: 'Total events processed by gateway',
  FAILED_EVENTS: 'Total events failed by gateway',
};
