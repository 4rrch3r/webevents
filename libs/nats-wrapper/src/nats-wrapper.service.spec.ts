import { Test, TestingModule } from '@nestjs/testing';
import { NatsWrapperService } from './nats-wrapper.service';

describe('NatsWrapperService', () => {
  let service: NatsWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatsWrapperService],
    }).compile();

    service = module.get<NatsWrapperService>(NatsWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
