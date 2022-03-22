import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs'

@Module({

  imports: [ ClientsModule.register([
    {
      name: 'FLY_MANAGER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'fly-manager',
          brokers: [process.env.KAFKA_URL1,process.env.KAFKA_URL2,process.env.KAFKA_URL3],
          connectionTimeout: 8000,
          retry: {
            initialRetryTime: 300,
            retries: 8
          },          ssl: {
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
          groupId: 'fly-manager-consumer'
        }
      }
    },
  ]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
