import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RevenueReportDto } from './dto/revenue.report';
import { DemographyReportDto } from './dto/demography.report';
import { ReporterMetricsService } from './metrics/reporter.metrics.service';
import { WebhookSources } from 'libs/utils';
import { METRIC_REPORTS } from './utils';

@Injectable()
export class ReporterService {
  private readonly logger = new Logger(ReporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reporterMetricsService: ReporterMetricsService,
  ) {}

  async generateRevenueReport(params: RevenueReportDto) {
    return this.reporterMetricsService.trackLatency(
      METRIC_REPORTS.REVENUE,
      async () => {
        try {
          const { from, to, source, campaignId } = params;
          const isSourceFacebook = source === WebhookSources.FACEBOOK;

          const where: any = {
            timestamp: {
              gte: new Date(from),
              lte: new Date(to),
            },
            eventType: isSourceFacebook ? 'checkout.complete' : 'purchase',
          };

          if (campaignId && isSourceFacebook) {
            where.engagementBottom = { campaignId };
          }

          return isSourceFacebook
            ? await this.prisma.fbEvent.findMany({
                where,
                include: {
                  engagementBottom: true,
                  user: true,
                },
              })
            : await this.prisma.ttEvent.findMany({
                where,
                include: {
                  engagementBottom: true,
                  user: true,
                },
              });
        } catch (error) {
          this.logger.error('Failed to generate revenue report', error.stack);
          throw new InternalServerErrorException(
            'Could not generate revenue report',
          );
        }
      },
    );
  }

  async generateDemographicsReport(params: DemographyReportDto) {
    return this.reporterMetricsService.trackLatency(
      METRIC_REPORTS.DEMOGRAPHICS,
      async () => {
        try {
          const { from, to, source, country } = params;
          const isSourceFacebook = source === WebhookSources.FACEBOOK;

          const eventFilter: any = {
            timestamp: {
              gte: new Date(from),
              lte: new Date(to),
            },
          };

          const userFilters: any = {
            events: {
              some: eventFilter,
            },
          };

          if (country && isSourceFacebook) {
            userFilters.country = country;
          }

          const eventIncludeFilter: any = {
            where: eventFilter,
            include: {
              engagementTop: true,
              engagementBottom: true,
            },
            orderBy: {
              timestamp: 'desc',
            },
            take: 1,
          };

          if (country && !isSourceFacebook) {
            eventIncludeFilter.where.engagementTop = {
              country,
            };
          }

          const users = isSourceFacebook
            ? await this.prisma.fbUser.findMany({
                where: userFilters,
                include: {
                  events: eventIncludeFilter,
                },
              })
            : await this.prisma.ttUser.findMany({
                where: userFilters,
                include: {
                  events: eventIncludeFilter,
                },
              });

          return users.map((user) => {
            const latestEvent = user.events[0];

            if (isSourceFacebook) {
              return {
                userId: user.externalId,
                name: user.name,
                age: user.age,
                gender: user.gender,
                location: {
                  country: user.country,
                  city: user.city,
                },
                lastEventType: latestEvent?.eventType,
                lastEventTime: latestEvent?.timestamp,
                totalEvents: user.events.length,
              };
            } else {
              return {
                userId: user.externalId,
                username: user.username,
                followers: user.followers,
                lastDevice: latestEvent?.engagementTop?.device,
                lastEventType: latestEvent?.eventType,
                lastEventTime: latestEvent?.timestamp,
                watchTime: latestEvent?.engagementTop?.watchTime,
                country: latestEvent?.engagementTop?.country,
                totalEvents: user.events.length,
              };
            }
          });
        } catch (error) {
          this.logger.error(
            'Failed to generate demographics report',
            error.stack,
          );
          throw new InternalServerErrorException(
            'Could not generate demographics report',
          );
        }
      },
    );
  }
}
