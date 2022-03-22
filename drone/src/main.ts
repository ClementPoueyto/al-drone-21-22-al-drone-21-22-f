import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservicekafka  = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'navigator',
        brokers: [process.env.KAFKA_SERVER_URL+':9092',process.env.KAFKA_SERVER_URL+':9093',process.env.KAFKA_SERVER_URL+':9094'],
        ssl: {
          rejectUnauthorized: false,
          ca: [fs.readFileSync('src/SSL_Client/client-ca-signed.crt', 'utf-8')],
           },
        sasl:{
          mechanism: 'plain', 
          username: 'admin',
          password: 'admin-secret'
        }
      },
      consumer: {
        groupId: 'navigator-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(4021);
}
bootstrap();
