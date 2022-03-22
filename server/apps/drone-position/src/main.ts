import { NestFactory } from '@nestjs/core';
import { DronePositionModule } from './drone-position.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(DronePositionModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'drone-position',
        brokers: [process.env.KAFKA_URL1,process.env.KAFKA_URL2,process.env.KAFKA_URL3],
        connectionTimeout: 8000,
        retry: {
          initialRetryTime: 300,
          retries: 8
        },
        ssl: {
          rejectUnauthorized: false,
          ca: [fs.readFileSync('apps/SSL_Client/client-ca-signed.crt', 'utf-8')],
           },
        sasl:{
          mechanism: 'plain', 
          username: 'admin',
          password: 'admin-secret'
        }
      },
      consumer: {
        groupId: 'drone-position-consumer'
      }
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);

}
bootstrap();

