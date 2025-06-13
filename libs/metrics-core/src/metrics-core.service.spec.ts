import { Test, TestingModule } from '@nestjs/testing';
import { MetricsCoreService } from './metrics-core.service';

describe('MetricsCoreService', () => {
  let service: MetricsCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsCoreService],
    }).compile();

    service = module.get<MetricsCoreService>(MetricsCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
