import { z } from 'zod';

const timestampSchema = z.string().datetime();

export const locationSchema = z.object({
  country: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
});

export const fbUserSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(1).max(120),
  gender: z.enum(['male', 'female', 'non-binary']),
  location: locationSchema,
});

export const fbEngagementTopSchema = z.object({
  actionTime: timestampSchema,
  referrer: z.enum(['newsfeed', 'marketplace', 'groups']),
  videoId: z.string().min(1).max(50).nullable(),
});

export const fbEngagementBottomSchema = z.object({
  adId: z.string().min(1).max(50),
  campaignId: z.string().min(1).max(50),
  clickPosition: z.enum(['top_left', 'bottom_right', 'center']),
  device: z.enum(['mobile', 'desktop']),
  browser: z.enum(['Chrome', 'Firefox', 'Safari']),
  purchaseAmount: z.string().nullable(),
});

export const fbEventDataSchema = z.object({
  user: fbUserSchema,
  engagement: z.union([fbEngagementTopSchema, fbEngagementBottomSchema]),
});

export const fbEventSchema = z.object({
  eventId: z.string(),
  timestamp: timestampSchema,
  source: z.literal('facebook'),
  funnelStage: z.enum(['top', 'bottom']),
  eventType: z.union([
    z.literal('ad.view'),
    z.literal('page.like'),
    z.literal('comment'),
    z.literal('video.view'),
    z.literal('ad.click'),
    z.literal('form.submission'),
    z.literal('checkout.complete'),
  ]),
  data: fbEventDataSchema,
});

export type FbEvent = z.infer<typeof fbEventSchema>;
