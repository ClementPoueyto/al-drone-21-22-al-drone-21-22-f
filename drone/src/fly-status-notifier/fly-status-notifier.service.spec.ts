import { Test, TestingModule } from '@nestjs/testing';
import { FlyStatusNotifierService } from './fly-status-notifier.service';

describe('FlyStatusNotifierService', () => {
  let service: FlyStatusNotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlyStatusNotifierService],
    }).compile();

    service = module.get<FlyStatusNotifierService>(FlyStatusNotifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
