import { NatsWrapperService } from '@app/nats-wrapper';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { FbCollectorValidationService } from './validation/fb-collector.validation.service';
import { FbCollectorDataService } from './data/fb-collector.data.service';
import { FbCollectorMetricsService } from './metrics/fb-collector.metrics.service';
import { NatsSubjects } from 'libs/utils';

@Injectable()
export class FbCollectorService implements OnModuleInit {
  constructor(
    private readonly nats: NatsWrapperService,
    private readonly fbCollectorValidationService: FbCollectorValidationService,
    private readonly fbCollectorDataService: FbCollectorDataService,
    private readonly fbCollectorMetricsService: FbCollectorMetricsService,
  ) {}

  async onModuleInit() {
    await this.nats.subscribe(NatsSubjects.EVENTS_FACEBOOK, async (event) => {
      try {
        this.fbCollectorMetricsService.incAcceptedEvents();
        const validatedEvent =
          this.fbCollectorValidationService.validateEvent(event);

        await this.fbCollectorDataService.processFacebookEvent(validatedEvent);

        this.fbCollectorMetricsService.incProcessedEvents();
      } catch (error) {
        this.fbCollectorMetricsService.incFailedEvents();
        console.error(
          `[FB-Collector] Error while validation or processing: ${error}`,
        );
      }
    });
  }
}
