import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator';
import { WebhookSources } from 'libs/utils';

export class RevenueReportDto {
  @ApiProperty({
    example: '2020',
    description: 'Start date for the report',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    example: '2026',
    description: 'End date for the report',
  })
  @IsDateString()
  to: string;

  @ApiProperty({
    example: WebhookSources.FACEBOOK,
    description: 'Source of the webhook',
  })
  @IsString()
  @IsIn([WebhookSources.FACEBOOK, WebhookSources.TIKTOK])
  source: WebhookSources.FACEBOOK | WebhookSources.TIKTOK;

  @ApiProperty({
    required: false,
    example: 'camp-2yhOp',
    description: 'External campaign id',
  })
  @IsOptional()
  @IsString()
  campaignId?: string;
}
