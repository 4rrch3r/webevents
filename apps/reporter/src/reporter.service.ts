import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RevenueReportDto } from './dto/revenue.report';
import { DemographyReportDto } from './dto/demography.report';
import { ReporterMetricsService } from './metrics/reporter.metrics.service';

@Injectable()
export class ReporterService {
  private readonly logger = new Logger(ReporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reporterMetricsService: ReporterMetricsService,
  ) {}

  async generateRevenueReport(params: RevenueReportDto) {
    return this.reporterMetricsService.trackLatency(
      'revenue_report',
      async () => {
        try {
          const { from, to, source, campaignId } = params;
          const isSourceFacebook = source === 'facebook';

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
      'demographics_report',
      async () => {
        try {
          const { from, to, source } = params;
          const isSourceFacebook = source === 'facebook';

          const users = isSourceFacebook
            ? await this.prisma.fbUser.findMany({
                where: {
                  events: {
                    some: {
                      timestamp: {
                        gte: new Date(from),
                        lte: new Date(to),
                      },
                    },
                  },
                },
                include: {
                  events: {
                    where: {
                      timestamp: {
                        gte: new Date(from),
                        lte: new Date(to),
                      },
                    },
                    include: {
                      engagementTop: isSourceFacebook ? false : true,
                      engagementBottom: true,
                    },
                    orderBy: {
                      timestamp: 'desc',
                    },
                    take: 1,
                  },
                },
              })
            : await this.prisma.ttUser.findMany({
                where: {
                  events: {
                    some: {
                      timestamp: {
                        gte: new Date(from),
                        lte: new Date(to),
                      },
                    },
                  },
                },
                include: {
                  events: {
                    where: {
                      timestamp: {
                        gte: new Date(from),
                        lte: new Date(to),
                      },
                    },
                    include: {
                      engagementTop: isSourceFacebook ? false : true,
                      engagementBottom: true,
                    },
                    orderBy: {
                      timestamp: 'desc',
                    },
                    take: 1,
                  },
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
