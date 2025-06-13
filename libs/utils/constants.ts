export enum WebhookSources {
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
}

export enum NatsSubjects {
  EVENTS_FACEBOOK = 'events_facebook',
  EVENTS_TIKTOK = 'events_tiktok',
}
export const DEFAULT_SUBJECT_PATTERN = 'events_*';
