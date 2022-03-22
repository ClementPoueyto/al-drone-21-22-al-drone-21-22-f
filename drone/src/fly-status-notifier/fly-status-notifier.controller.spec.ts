import { Test, TestingModule } from '@nestjs/testing';
import { FlyStatusNotifierController } from './fly-status-notifier.controller';

describe('FlyStatusNotifierController', () => {
  let controller: FlyStatusNotifierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlyStatusNotifierController],
    }).compile();

    controller = module.get<FlyStatusNotifierController>(FlyStatusNotifierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
