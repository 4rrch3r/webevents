import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';
import { WebhookSources } from 'libs/utils';

export class DemographyReportDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsIn([WebhookSources.FACEBOOK, WebhookSources.TIKTOK])
  source: WebhookSources.FACEBOOK | WebhookSources.TIKTOK;

  @IsOptional()
  @IsString()
  country?: string;
}
