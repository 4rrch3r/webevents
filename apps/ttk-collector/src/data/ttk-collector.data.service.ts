import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { TtkEvent } from '../schemas/ttk-collector.events.schema';
import { TiktokEngagementBottom, TiktokEngagementTop } from 'libs/types';

@Injectable()
export class TtkCollectorDataService {
  constructor(private readonly prisma: PrismaService) {}

  async processTikTokEvent(eventData: TtkEvent): Promise<void> {
    return this.prisma.$transaction(async (_tx) => {
      const user = await this.upsertUser(this.prisma, eventData.data.user);
      const isTopEngagement = eventData.funnelStage === 'top';

      let engagementTopId: string | undefined;
      let engagementBottomId: string | undefined;

      if (isTopEngagement) {
        const engagement = eventData.data.engagement as TiktokEngagementTop;
        const created = await this.createTopEngagement(
          this.prisma,
          user.id,
          engagement,
        );
        engagementTopId = created.id;
      } else {
        const engagement = eventData.data.engagement as TiktokEngagementBottom;
        const created = await this.createBottomEngagement(
          this.prisma,
          user.id,
          engagement,
        );
        engagementBottomId = created.id;
      }

      await this.createEvent(this.prisma, {
        ...eventData,
        userId: user.id,
        engagementTopId,
        engagementBottomId,
      });
    });
  }

  private async upsertUser(
    prisma: PrismaService,
    userData: TtkEvent['data']['user'],
  ) {
    return prisma.ttUser.upsert({
      where: { id: userData.userId },
      create: {
        externalId: userData.userId,
        username: userData.username,
        followers: userData.followers,
      },
      update: {
        username: userData.username,
        followers: userData.followers,
      },
    });
  }

  private async createTopEngagement(
    prisma: PrismaService,
    userId: string,
    engagement: TiktokEngagementTop,
  ) {
    return prisma.ttEngagementTop.create({
      data: {
        watchTime: engagement.watchTime,
        percentageWatched: engagement.percentageWatched,
        device: engagement.device,
        country: engagement.country,
        videoId: engagement.videoId,
        userId: userId,
      },
    });
  }

  private async createBottomEngagement(
    prisma: PrismaService,
    userId: string,
    engagement: TiktokEngagementBottom,
  ) {
    return prisma.ttEngagementBottom.create({
      data: {
        actionTime: new Date(engagement.actionTime),
        profileId: engagement.profileId,
        purchasedItem: engagement.purchasedItem,
        purchaseAmount: engagement.purchaseAmount
          ? parseFloat(engagement.purchaseAmount)
          : null,
        userId: userId,
      },
    });
  }

  private async createEvent(
    prisma: PrismaService,
    eventData: Omit<TtkEvent, 'data'> & {
      userId: string;
      engagementTopId?: string;
      engagementBottomId?: string;
    },
  ) {
    return prisma.ttEvent.create({
      data: {
        externalId: eventData.eventId,
        timestamp: new Date(eventData.timestamp),
        funnelStage: eventData.funnelStage,
        eventType: eventData.eventType,
        userId: eventData.userId,
        engagementTopId: eventData.engagementTopId,
        engagementBottomId: eventData.engagementBottomId,
      },
    });
  }
}
