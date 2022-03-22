import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DroneParkManagerController } from './drone-park-manager.controller';
import { DroneParkManagerService } from './drone-park-manager.service';
import { closeInMongodConnection, rootMongooseTestModule } from './mongooseTestModule';
import { DroneStatus, DroneStatusSchema } from './schemas/drone-status.schema';

describe('DroneParkManagerController', () => {
  let droneParkManagerController: DroneParkManagerController;
  let droneParkManagerService: DroneParkManagerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[HttpModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: DroneStatus.name, schema: DroneStatusSchema }]),],
      controllers: [DroneParkManagerController],
      providers: [DroneParkManagerService],
    }).compile();

    droneParkManagerController = app.get<DroneParkManagerController>(DroneParkManagerController);
    droneParkManagerService = app.get<DroneParkManagerService>(DroneParkManagerService);
  
});

  describe('root', () => {
    it('attribute id to drone', async () => {

    jest.spyOn(droneParkManagerService, 'callDeliveryPlanner').mockImplementation(() => new Promise(null));

      expect(await droneParkManagerController.getDroneReady({"value":{"droneId": -1}})).toBe(0);
      expect(await droneParkManagerController.getDroneReady({"value":{"droneId": -1}})).toBe(1);
      expect(await droneParkManagerController.getDroneReady({"value":{"droneId": -1}})).toBe(2);

    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});