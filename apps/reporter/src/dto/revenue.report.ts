import { IsOptional, IsString, IsDateString } from 'class-validator';
import { WebhookSources } from 'libs/utils';

export class RevenueReportDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsString()
  source: WebhookSources.FACEBOOK | WebhookSources.TIKTOK;

  @IsOptional()
  @IsString()
  campaignId?: string;
}
