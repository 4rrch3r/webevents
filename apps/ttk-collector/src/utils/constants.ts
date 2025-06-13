export const APP_DEFAULT_PORT = 3002;
export const DEFAULT_METRICS_PREFIX = 'tiktok_';

export enum TtkMetricNames {
  AcceptedEvents = 'ttk_accepted_events_total',
  ProcessedEvents = 'ttk_processed_events_total',
  FailedEvents = 'ttk_failed_events_total',
}

export enum TtkMetricHelp {
  AcceptedEvents = 'Total events accepted by tiktok collector',
  ProcessedEvents = 'Total events processed by tiktok collector',
  FailedEvents = 'Total events failed by tiktok collector',
}

export enum TtkMetricLabels {
  Source = 'source',
  Quantity = 'quantity',
}
