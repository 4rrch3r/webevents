import { Module } from '@nestjs/common';
import { NatsWrapperService } from './nats-wrapper.service';

@Module({
  imports: [],
  providers: [NatsWrapperService],
  exports: [NatsWrapperService],
})
export class NatsWrapperModule {}
