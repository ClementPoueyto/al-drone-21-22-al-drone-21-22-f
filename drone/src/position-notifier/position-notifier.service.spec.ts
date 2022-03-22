import { Test, TestingModule } from '@nestjs/testing';
import { PositionNotifierService } from './position-notifier.service';

describe('PositionNotifierService', () => {
  let service: PositionNotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionNotifierService],
    }).compile();

    service = module.get<PositionNotifierService>(PositionNotifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
