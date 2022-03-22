import { TimedPositionDto } from './dto/timed-position.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { DronePositionController } from './drone-position.controller';
import { DronePositionService } from './drone-position.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PositionChanged, PositionChangedSchema } from './schemas/position-changed.schema';
import { closeInMongodConnection, rootMongooseTestModule } from './mongooseTestModule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DronePositionChangedDto } from './dto/drone-position-changed.dto';
import { Position } from './dto/position.dto';

describe('DronePositionController', () => {
  let dronePositionController: DronePositionController;
  let dronePositionService: DronePositionService;
  const today = new Date();

  
  beforeEach(async () => {
    
    const app: TestingModule = await Test.createTestingModule({
      imports:[
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: PositionChanged.name, schema: PositionChangedSchema }]),
        ClientsModule.register([
          {
            name: 'DRONE_POSITION',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'drone-position',
                brokers: ['kafka:9092'],
              },
              consumer: {
                groupId: 'drone-position-consumer'
              }
            }
          },])
      ],
      controllers: [DronePositionController],
      providers: [DronePositionService],
    }).compile();
    dronePositionService= app.get<DronePositionService>(DronePositionService);
    dronePositionController = app.get<DronePositionController>(DronePositionController);
  });

  describe('root', () => {
    it('get position drone', async () => {
      const pos1 = new DronePositionChangedDto(1,today, {latitude:20, longitude:20});
      const pos2 = new DronePositionChangedDto(1,today, {latitude:10, longitude:10});
      await dronePositionService.store(pos1);
      await dronePositionService.store(pos2);

      expect(await dronePositionController.getPosition('[1]')).toStrictEqual({"1": {latitude:10, longitude:10},});
    });


    it('isValidPosition', async () => {
      const pos1 = new DronePositionChangedDto(1,today, {latitude:20, longitude:20});
      const pos2 = new DronePositionChangedDto(1,today, {latitude:10, longitude:10});
      await dronePositionService.store(pos1);
      await dronePositionService.store(pos2);

      const pos3 = new DronePositionChangedDto(1,today, {latitude:10.01, longitude:10});
      expect(await dronePositionService.isValidPosition(pos3)).toStrictEqual(true);

      const pos4 = new DronePositionChangedDto(1,today, {latitude:13.01, longitude:10});
      expect(await dronePositionService.isValidPosition(pos4)).toStrictEqual(false);

      const pos5 = new DronePositionChangedDto(1,today, {latitude:10.1, longitude:10});
      expect(await dronePositionService.isValidPosition(pos5)).toStrictEqual(false);
    });

    it('get position between dates', async () => {
      const day1 = new Date("2021-10-02T00:00:00.000Z")
      const pos1 = new DronePositionChangedDto(1,day1, {latitude:20, longitude:20});
      const pos2 = new DronePositionChangedDto(1,new Date("2021-12-01T00:00:00.000Z"), {latitude:10, longitude:10});
      await dronePositionService.store(pos1);
      await dronePositionService.store(pos2);
      const tomorrow = new Date("2021-10-03T00:00:00.000Z")
      const yesterday = new Date("2021-10-01T00:00:00.000Z")

      expect(await dronePositionService.getPositionBetweenDates([1], today, today)).toStrictEqual({"1": null});

      expect(await dronePositionService.getPositionBetweenDates([1], new Date("2020-12-01T00:00:00.000Z"), yesterday)).toStrictEqual({"1": null});

      expect(JSON.stringify(await dronePositionService.getPositionBetweenDates([1], yesterday, tomorrow))).toStrictEqual(
        "{\"1\":[{\"timestamp\":\""+day1.toISOString()+"\",\"position\":{\"latitude\":20,\"longitude\":20}}]}"
      );

    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
