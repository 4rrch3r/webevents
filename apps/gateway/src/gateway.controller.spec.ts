import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { NatsWrapperService } from '@app/nats-wrapper';
import { GatewayMetricsService } from './metrics/gateway.metrics.service';
import { Response } from 'express';
import { NatsSubjects, WebhookSources } from '../../../libs/utils';

describe('GatewayController', () => {
  let controller: GatewayController;
  let natsService: jest.Mocked<NatsWrapperService>;
  let metricsService: jest.Mocked<GatewayMetricsService>;

  beforeEach(async () => {
    const mockNatsService = {
      publish: jest.fn().mockReturnValue(undefined),
    };

    const mockMetricsService = {
      incAcceptedEvents: jest.fn(),
      incProcessedEvents: jest.fn(),
      incFailedEvents: jest.fn(),
      getContentType: jest.fn().mockReturnValue('text/plain'),
      getMetrics: jest.fn().mockResolvedValue('mock_metrics'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: NatsWrapperService,
          useValue: mockNatsService,
        },
        {
          provide: GatewayMetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    natsService = module.get(NatsWrapperService);
    metricsService = module.get(GatewayMetricsService);
  });

  describe('postWebhook', () => {
    const facebookWebhook = {
      eventId: 'fb-fa3e4d6c-7062-4e6f-8f55-f8f41f7425cb',
      timestamp: '2025-06-10T18:01:43.455Z',
      source: WebhookSources.FACEBOOK,
      funnelStage: 'top',
      eventType: 'ad.view',
      data: {
        user: {
          userId: '81ac3c92-30ad-4290-974c-1d5273b230af',
          name: 'Gregory Zulauf DVM',
          age: 58,
          gender: 'male',
          location: {
            city: 'Kyiv',
            country: 'Ukraine',
          },
        },
        engagement: {
          actionTime: '2025-06-10T18:01:43.455Z',
          referrer: 'newsfeed',
          videoId: null,
        },
      },
    };

    const tiktokWebhook = {
      eventId: 'ttk-cf30e5ff-a2a5-4854-9a92-9d99e3f4da67',
      timestamp: '2025-06-10T18:01:44.759Z',
      source: 'tiktok',
      funnelStage: 'bottom',
      eventType: 'profile.visit',
      data: {
        user: {
          userId: '55e08dd7-e088-451a-b80e-2639138a6f99',
          username: 'Eliza92',
          followers: 423769,
        },
        engagement: {
          actionTime: '2025-06-10T18:01:44.759Z',
          profileId: 'profile-I6SF6J',
          purchasedItem: null,
          purchaseAmount: null,
        },
      },
    };

    it('should process Facebook webhooks with complete data', () => {
      const result = controller.postWebhook([facebookWebhook]);

      expect(result).toEqual([facebookWebhook]);
      expect(natsService.publish).toHaveBeenCalledWith(
        NatsSubjects.EVENTS_FACEBOOK,
        facebookWebhook,
      );
      expect(metricsService.incAcceptedEvents).toHaveBeenCalledWith(1);
      expect(metricsService.incProcessedEvents).toHaveBeenCalled();
      expect(metricsService.incFailedEvents).not.toHaveBeenCalled();
    });

    it('should process TikTok webhooks with complete data', () => {
      const result = controller.postWebhook([tiktokWebhook]);

      expect(result).toEqual([tiktokWebhook]);
      expect(natsService.publish).toHaveBeenCalledWith(
        NatsSubjects.EVENTS_TIKTOK,
        tiktokWebhook,
      );
      expect(metricsService.incAcceptedEvents).toHaveBeenCalledWith(1);
      expect(metricsService.incProcessedEvents).toHaveBeenCalled();
      expect(metricsService.incFailedEvents).not.toHaveBeenCalled();
    });

    it('should process mixed webhook sources', () => {
      const webhooks = [facebookWebhook, tiktokWebhook];
      const result = controller.postWebhook(webhooks);

      expect(result).toEqual(webhooks);
      expect(natsService.publish).toHaveBeenCalledWith(
        NatsSubjects.EVENTS_FACEBOOK,
        facebookWebhook,
      );
      expect(natsService.publish).toHaveBeenCalledWith(
        NatsSubjects.EVENTS_TIKTOK,
        tiktokWebhook,
      );
      expect(metricsService.incAcceptedEvents).toHaveBeenCalledWith(2);
      expect(metricsService.incProcessedEvents).toHaveBeenCalled();
      expect(metricsService.incFailedEvents).not.toHaveBeenCalled();
    });

    it('should handle empty webhook array', () => {
      const result = controller.postWebhook([]);

      expect(result).toEqual([]);
      expect(natsService.publish).not.toHaveBeenCalled();
      expect(metricsService.incAcceptedEvents).toHaveBeenCalledWith(0);
      expect(metricsService.incProcessedEvents).toHaveBeenCalled();
      expect(metricsService.incFailedEvents).not.toHaveBeenCalled();
    });

    it('should increment failed events on NATS error', () => {
      natsService.publish.mockImplementationOnce(() => {
        throw new Error('NATS error');
      });

      controller.postWebhook([facebookWebhook]);

      expect(metricsService.incAcceptedEvents).toHaveBeenCalledWith(1);
      expect(metricsService.incProcessedEvents).not.toHaveBeenCalled();
      expect(metricsService.incFailedEvents).toHaveBeenCalled();
    });
  });

  describe('getMetrics', () => {
    it('should return metrics successfully', async () => {
      const mockResponse = {
        set: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getMetrics(mockResponse);

      expect(metricsService.getContentType).toHaveBeenCalled();
      expect(mockResponse.set).toHaveBeenCalledWith(
        'Content-Type',
        'text/plain',
      );
      expect(metricsService.getMetrics).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalledWith('mock_metrics');
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle metrics generation error', async () => {
      metricsService.getMetrics.mockRejectedValueOnce(
        new Error('Metrics error'),
      );
      const mockResponse = {
        set: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getMetrics(mockResponse);

      expect(metricsService.getContentType).toHaveBeenCalled();
      expect(mockResponse.set).toHaveBeenCalled();
      expect(metricsService.getMetrics).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
