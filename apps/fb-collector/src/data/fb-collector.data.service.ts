import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { FbEvent } from '../schemas/fb-collector.events.schema';
import { FacebookEngagementBottom, FacebookEngagementTop } from 'libs/types';

@Injectable()
export class FbCollectorDataService {
  constructor(private readonly prisma: PrismaService) {}

  async processFacebookEvent(eventData: FbEvent): Promise<void> {
    return this.prisma.$transaction(async (_tx) => {
      const user = await this.upsertUser(this.prisma, eventData.data.user);
      const isTopEngagement = eventData.funnelStage === 'top';

      let engagementTopId: string | undefined;
      let engagementBottomId: string | undefined;

      if (isTopEngagement) {
        const engagement = eventData.data.engagement as FacebookEngagementTop;
        const created = await this.createTopEngagement(
          this.prisma,
          user.id,
          engagement,
        );
        engagementTopId = created.id;
      } else {
        const engagement = eventData.data
          .engagement as FacebookEngagementBottom;
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
    userData: FbEvent['data']['user'],
  ) {
    return prisma.fbUser.upsert({
      where: { externalId: userData.userId },
      create: {
        externalId: userData.userId,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        country: userData.location.country,
        city: userData.location.city,
      },
      update: {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        country: userData.location.country,
        city: userData.location.city,
      },
    });
  }

  private async createTopEngagement(
    prisma: PrismaService,
    userId: string,
    engagement: FacebookEngagementTop,
  ) {
    return prisma.fbEngagementTop.create({
      data: {
        actionTime: new Date(engagement.actionTime),
        referrer: engagement.referrer,
        videoId: engagement.videoId,
        userId: userId,
      },
    });
  }

  private async createBottomEngagement(
    prisma: PrismaService,
    userId: string,
    engagement: FacebookEngagementBottom,
  ) {
    return prisma.fbEngagementBottom.create({
      data: {
        adId: engagement.adId,
        campaignId: engagement.campaignId,
        clickPosition: engagement.clickPosition,
        device: engagement.device,
        browser: engagement.browser,
        purchaseAmount: engagement.purchaseAmount
          ? parseFloat(engagement.purchaseAmount)
          : null,
        userId: userId,
      },
    });
  }

  private async createEvent(
    prisma: PrismaService,
    eventData: Omit<FbEvent, 'data'> & {
      userId: string;
      engagementTopId?: string;
      engagementBottomId?: string;
    },
  ) {
    return prisma.fbEvent.create({
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
