import {
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DemographyReportDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsIn(['facebook', 'tiktok'])
  source: 'facebook' | 'tiktok';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genders?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ageRanges?: [number, number][];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  followerRanges?: [number, number][];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  devices?: ('Android' | 'iOS' | 'Desktop')[];
}
