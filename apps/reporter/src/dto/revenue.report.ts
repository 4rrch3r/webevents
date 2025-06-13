import { IsOptional, IsString, IsDateString } from 'class-validator';

export class RevenueReportDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsString()
  source: 'facebook' | 'tiktok';

  @IsOptional()
  @IsString()
  campaignId?: string;
}
