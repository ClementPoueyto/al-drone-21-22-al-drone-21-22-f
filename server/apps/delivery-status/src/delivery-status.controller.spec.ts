import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryStatusController } from './delivery-status.controller';
import { DeliveryStatusService } from './delivery-status.service';
import { DeliveryStatus, DeliveryStatusSchema } from './schemas/delivery-status.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from './mongooseTestModule';

describe('DeliveryStatusController', () => {
  let deliveryStatusController: DeliveryStatusController;
  let deliveryStatusService: DeliveryStatusService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[HttpModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: DeliveryStatus.name, schema: DeliveryStatusSchema }]),
      ],
      controllers: [DeliveryStatusController],
      providers: [DeliveryStatusService],
    }).compile();

    deliveryStatusController = app.get<DeliveryStatusController>(DeliveryStatusController);
    deliveryStatusService = app.get<DeliveryStatusService>(DeliveryStatusService);

  });


  describe('root', () => {
    it('status update', async () => {

    jest.spyOn(deliveryStatusService, 'droneStartDelivering').mockImplementation(() => null);

      await deliveryStatusController.statusReceived({"value":{"droneId":"0","timestamp":"2021-11-02T11:40:18.000Z","deliveryStatus":"GROUNDBASED","position":{"latitude":0,"longitude":0}}});
      expect(await deliveryStatusController.getDeliveryStatusByDeliveryId("1")).toStrictEqual(null);
      
      await deliveryStatusController.statusReceived({"value":{"droneId":"0","timestamp":"2021-11-02T11:40:18.000Z","deliveryStatus":"DELIVERED","position":{"latitude":0,"longitude":0}}});
      expect(await deliveryStatusController.getDeliveryStatusByDeliveryId("1")).toStrictEqual(null);
      
      await deliveryStatusController.statusReceived({"value":{"orderId":"1","droneId":"0","timestamp":"2021-11-02T11:40:18.000Z","deliveryStatus":"FLY","position":{"latitude":0,"longitude":0}}});
      const status = await deliveryStatusController.getDeliveryStatusByDeliveryId("1");
      expect(status.deliveryStatus).toStrictEqual("FLY");
      expect(status.orderId).toStrictEqual("1");
      expect(status.droneId).toStrictEqual("0");


      await deliveryStatusController.statusReceived({"value":{"orderId":"1","droneId":"0","timestamp":"2021-11-02T11:40:18.000Z","deliveryStatus":"DELIVERED","position":{"latitude":0,"longitude":0}}});
      const status2 = await deliveryStatusController.getDeliveryStatusByDeliveryId("1");
      expect(status2.deliveryStatus).toStrictEqual("DELIVERED");
      expect(status2.orderId).toStrictEqual("1");
      expect(status2.droneId).toStrictEqual("0");
    });

    it('get all drone', async () => {

    jest.spyOn(deliveryStatusService, 'droneStartDelivering').mockImplementation(() => null);

      await deliveryStatusController.statusReceived({"value":{"droneId":"0","timestamp":"2021-11-02T11:40:18.000Z","deliveryStatus":"GROUNDBASED","position":{"latitude":0,"longitude":0}}});
      expect(await deliveryStatusController.GetAllDroneStatus()).toStrictEqual([]);
      
      await deliveryStatusController.statusReceived({"value":{"orderId":32,"droneId":"0","timestamp":"2021-11-02T11:40:18.000Z","deliveryStatus":"FLY","position":{"latitude":0,"longitude":0}}});
      expect(await deliveryStatusController.GetAllDroneStatus()).toStrictEqual([{"droneId": "0", "status": "FLY"}]);
      
      
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });

  
});