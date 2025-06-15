import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { NatsWrapperService } from '@app/nats-wrapper';
import { Response } from 'express';
import { GatewayMetricsService } from './metrics/gateway.metrics.service';
import { NatsSubjects, WebhookSources } from '../../../libs/utils';

@Controller()
export class GatewayController {
  constructor(
    private readonly nats: NatsWrapperService,
    private readonly gatewayMetricsService: GatewayMetricsService,
  ) {}

  @Post('webhooks')
  postWebhook(@Body() body: any): string {
    try {
      const webhookCount = body.length;
      this.gatewayMetricsService.incAcceptedEvents(webhookCount);

      for (let webhook of body) {
        if (webhook.source === WebhookSources.TIKTOK) {
          this.nats.publish(NatsSubjects.EVENTS_TIKTOK, webhook);
        } else if (webhook.source === WebhookSources.FACEBOOK) {
          this.nats.publish(NatsSubjects.EVENTS_FACEBOOK, webhook);
        }
      }
      this.gatewayMetricsService.incProcessedEvents();
      return body;
    } catch (error) {
      this.gatewayMetricsService.incFailedEvents();
      console.error(`[Gateway] Error while collecting webhooks: ${error}`);
    }
  }
  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    try {
      res.set('Content-Type', this.gatewayMetricsService.getContentType());
      const metrics = await this.gatewayMetricsService.getMetrics();
      res.send(metrics);
    } catch (err) {
      res.status(500).send('[Gateway] Error while generating metrics');
    }
  }
}
