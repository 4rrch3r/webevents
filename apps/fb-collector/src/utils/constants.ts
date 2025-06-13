export const APP_DEFAULT_PORT = 3001;
export const DEFAULT_METRICS_PREFIX = 'facebook_';

export enum FbCollectorMetricNames {
  ACCEPTED_EVENTS = 'fb_accepted_events_total',
  PROCESSED_EVENTS = 'fb_processed_events_total',
  FAILED_EVENTS = 'fb_failed_events_total',
}

export enum FbCollectorMetricLabels {
  SOURCE = 'source',
  QUANTITY = 'quantity',
}

export const FB_COLLECTOR_METRICS_HELP_TEXT = {
  ACCEPTED_EVENTS: 'Total events accepted by facebook collector',
  PROCESSED_EVENTS: 'Total events processed by facebook collector',
  FAILED_EVENTS: 'Total events failed by facebook collector',
};
