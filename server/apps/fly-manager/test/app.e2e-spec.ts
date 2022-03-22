import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],

    }).compile();

   /* const restartOnFailure = jest.fn(async () => false)
        const kafka = new Kafka({
            clientId: 'example-consumer',
            logLevel: logLevel.ERROR,
            brokers: ['localhost:9092'],
        })
        const consumer = kafka.consumer({ 
            groupId: 'test-group',
            retry: {
                retries: 0,
                initialRetryTime: 1,
                restartOnFailure,
            },
        });
        const run = async () => {
          await consumer.connect()
          await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
          await consumer.run({
              eachMessage: async ({ topic, partition, message }) => {
                  //const decodedKey = await registry.decode(message.key)
                  //const decodedValue = await registry.decode(message.value)
                  //console.log({ decodedKey, decodedValue })
              },
          })
      }
      await run().catch(console.error)*/
    app = moduleFixture.createNestApplication();
    //server = app.getHttpAdapter().getInstance();

    /*app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    });
    app.enableShutdownHooks();
    await app.startAllMicroservices();*/
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  /*it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ droneId: 1, itinerary: [{"latitude":-0.01,
      "longitude": 0.03
     },], orderId:10 })
      .expect(201)
      .expect('Hello World!');
  });*/
});
