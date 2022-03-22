import { Test, TestingModule } from '@nestjs/testing';
import { PositionNotifierController } from './position-notifier.controller';

describe('PositionNotifierController', () => {
  let controller: PositionNotifierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionNotifierController],
    }).compile();

    controller = module.get<PositionNotifierController>(PositionNotifierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
