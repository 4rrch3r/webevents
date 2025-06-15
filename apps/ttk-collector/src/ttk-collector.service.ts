import { NatsWrapperService } from '@app/nats-wrapper';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TtkCollectorValidationService } from './validation/ttk-collector.validation.service';
import { TtkCollectorDataService } from './data/ttk-collector.data.service';
import { TtkCollectorMetricsService } from './metrics/ttk-collector.metrics.service';
import { NatsSubjects } from 'libs/utils';

@Injectable()
export class TtkCollectorService implements OnModuleInit {
  constructor(
    private readonly nats: NatsWrapperService,
    private readonly ttkCollectorValidationService: TtkCollectorValidationService,
    private readonly ttkCollectorDataService: TtkCollectorDataService,
    private readonly ttkCollectorMetricsService: TtkCollectorMetricsService,
  ) {}

  async onModuleInit() {
    await this.nats.subscribe(NatsSubjects.EVENTS_TIKTOK, async (event) => {
      try {
        this.ttkCollectorMetricsService.incAcceptedEvents();

        const validatedEvent =
          this.ttkCollectorValidationService.validateEvent(event);

        await this.ttkCollectorDataService.processTikTokEvent(validatedEvent);
        this.ttkCollectorMetricsService.incProcessedEvents();
      } catch (error) {
        this.ttkCollectorMetricsService.incFailedEvents();
        console.log(
          `[TTK-Collector] Error while validation or processing: ${error}`,
        );
      }
    });
  }
}
