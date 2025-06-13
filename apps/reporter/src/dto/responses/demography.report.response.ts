import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ example: 'Ukraine' })
  country: string;

  @ApiProperty({ example: 'Fort Elliotview' })
  city: string;
}

export class DemographicResponseOkDto {
  @ApiProperty({ example: '9235aa90-92f2-416b-8160-179af9b2a451' })
  userId: string;

  @ApiProperty({ example: 'Norman Schaden' })
  name: string;

  @ApiProperty({ example: 42 })
  age: number;

  @ApiProperty({ example: 'non-binary' })
  gender: string;

  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @ApiProperty({ example: 'video.view' })
  lastEventType: string;

  @ApiProperty({ example: '2025-06-13T17:27:49.250Z' })
  lastEventTime: string;

  @ApiProperty({ example: 1 })
  totalEvents: number;
}

export class DemographicResponseBadRequestDto {
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
