import { z } from 'zod';

const timestampSchema = z.string().datetime();

export const ttkUserSchema = z.object({
  userId: z.string(),
  username: z.string().min(1).max(100),
  followers: z.number().int().min(0),
});

export const ttkEngagementTopSchema = z.object({
  watchTime: z.number().int().min(0),
  percentageWatched: z.number().int().min(0).max(100),
  device: z.enum(['Android', 'iOS', 'Desktop']),
  country: z.string().min(1).max(100),
  videoId: z.string().min(1).max(50),
});

export const ttkEngagementBottomSchema = z.object({
  actionTime: timestampSchema,
  profileId: z.string().min(1).max(50).nullable(),
  purchasedItem: z.string().min(1).max(100).nullable(),
  purchaseAmount: z.string().nullable(),
});

export const ttkEventDataSchema = z.object({
  user: ttkUserSchema,
  engagement: z.union([ttkEngagementTopSchema, ttkEngagementBottomSchema]),
});

export const ttkEventSchema = z.object({
  eventId: z.string(),
  timestamp: timestampSchema,
  source: z.literal('tiktok'),
  funnelStage: z.enum(['top', 'bottom']),
  eventType: z.union([
    z.literal('video.view'),
    z.literal('like'),
    z.literal('share'),
    z.literal('comment'),
    z.literal('profile.visit'),
    z.literal('purchase'),
    z.literal('follow'),
  ]),
  data: ttkEventDataSchema,
});

export type TtkEvent = z.infer<typeof ttkEventSchema>;
