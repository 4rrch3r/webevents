import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  fbEngagementBottomSchema,
  fbEngagementTopSchema,
  FbEvent,
  fbEventSchema,
} from '../schemas/fb-collector.events.schema';

@Injectable()
export class FbCollectorValidationService {
  private readonly logger = new Logger(FbCollectorValidationService.name);

  validateEvent(data: unknown): FbEvent {
    try {
      return fbEventSchema.parse(data);
    } catch (error) {
      this.logger.error('Facebook event validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        data,
      });
      throw new Error(
        `Facebook event validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  validateEngagement(data: FbEvent) {
    const isTopFunnelEvent = data.funnelStage === 'top';

    return isTopFunnelEvent
      ? fbEngagementTopSchema.parse(data.data.engagement)
      : fbEngagementBottomSchema.parse(data.data.engagement);
  }
}
