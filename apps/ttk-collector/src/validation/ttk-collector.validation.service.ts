import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  ttkEngagementBottomSchema,
  ttkEngagementTopSchema,
  TtkEvent,
  ttkEventSchema,
  ttkUserSchema,
} from '../schemas/ttk-collector.events.schema';

@Injectable()
export class TtkCollectorValidationService {
  private readonly logger = new Logger(TtkCollectorValidationService.name);

  validateEvent(data: unknown): TtkEvent {
    try {
      return ttkEventSchema.parse(data);
    } catch (error) {
      this.logger.error('Tiktok event validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        data,
      });
      throw new Error(
        `Tiktok event validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  validateEngagement(data: TtkEvent) {
    const isTopFunnelEvent = data.funnelStage === 'top';

    return isTopFunnelEvent
      ? ttkEngagementTopSchema.parse(data.data.engagement)
      : ttkEngagementBottomSchema.parse(data.data.engagement);
  }
}
