import { NestFactory } from '@nestjs/core';
import { DeliveryStatusModule } from './delivery-status.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(DeliveryStatusModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'delivery-status',
        brokers: [process.env.KAFKA_URL1,process.env.KAFKA_URL2,process.env.KAFKA_URL3],
        connectionTimeout: 8000,
        retry: {
          initialRetryTime: 300,
          retries: 8
        },        ssl: {
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
        groupId: 'delivery-status-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
