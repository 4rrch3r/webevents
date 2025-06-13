import { ApiProperty } from '@nestjs/swagger';

class EngagementBottomDto {
  @ApiProperty({ example: '31897d3d-f74e-44f1-acda-b0626e1d8b3d' })
  id: string;

  @ApiProperty({ example: 'ad-NKF5dibj' })
  adId: string;

  @ApiProperty({ example: 'camp-5fCRI' })
  campaignId: string;

  @ApiProperty({ example: 'center' })
  clickPosition: string;

  @ApiProperty({ example: 'desktop' })
  device: string;

  @ApiProperty({ example: 'Firefox' })
  browser: string;

  @ApiProperty({ example: 774.19 })
  purchaseAmount: number;

  @ApiProperty({ example: '4382f642-9bea-45fb-a366-800a02ca80b4' })
  userId: string;
}

class UserDto {
  @ApiProperty({ example: '4382f642-9bea-45fb-a366-800a02ca80b4' })
  id: string;

  @ApiProperty({ example: '4e98a8bc-9472-4fb0-a5d3-eea71c96772d' })
  externalId: string;

  @ApiProperty({ example: 'Alfred McKenzie III' })
  name: string;

  @ApiProperty({ example: 37 })
  age: number;

  @ApiProperty({ example: 'non-binary' })
  gender: string;

  @ApiProperty({ example: 'Belgium' })
  country: string;

  @ApiProperty({ example: 'Darenfield' })
  city: string;
}

export class RevenueResponseOkDto {
  @ApiProperty({ example: '6097a38d-833c-4f55-af3b-745184f88c92' })
  id: string;

  @ApiProperty({ example: 'fb-fd8401a6-943b-4e4f-9a26-c398ef559175' })
  externalId: string;

  @ApiProperty({ example: '2025-06-13T17:20:58.534Z' })
  timestamp: string;

  @ApiProperty({ example: 'bottom' })
  funnelStage: string;

  @ApiProperty({ example: 'checkout.complete' })
  eventType: string;

  @ApiProperty({ example: '4382f642-9bea-45fb-a366-800a02ca80b4' })
  userId: string;

  @ApiProperty({ example: null, nullable: true })
  engagementTopId: string | null;

  @ApiProperty({
    example: '31897d3d-f74e-44f1-acda-b0626e1d8b3d',
    nullable: true,
  })
  engagementBottomId: string | null;

  @ApiProperty({ type: EngagementBottomDto, nullable: true })
  engagementBottom?: EngagementBottomDto;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class RevenueResponseBadRequestDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: [
      'from must be a valid ISO 8601 date string',
      'to must be a valid ISO 8601 date string',
      'source must be one of the following values: facebook, tiktok',
      'source must be a string',
    ],
    type: [String],
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
