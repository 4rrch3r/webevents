export const APP_DEFAULT_PORT = 3000;
export const REQUEST_LIMIT = '50mb';
export const DEFAULT_METRICS_PREFIX = 'gateway_';

export const METRIC_NAMES = {
  REQUEST_DURATION: 'reporter_request_duration_seconds',
  REQUEST_COUNT: 'reporter_request_count',
  ERROR_COUNT: 'reporter_error_count',
};

export const METRIC_HELP = {
  REQUEST_DURATION: 'Duration of reporter service requests in seconds',
  REQUEST_COUNT: 'Total number of reporter service requests',
  ERROR_COUNT: 'Total number of reporter service errors',
};

export const METRIC_LABELS = {
  DURATION: ['category', 'success'],
  COUNT: ['category'],
};
export const METRIC_REPORTS = {
  REVENUE: 'revenue_report',
  DEMOGRAPHICS: 'demographics_report',
};
