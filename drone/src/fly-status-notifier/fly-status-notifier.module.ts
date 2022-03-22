import { Module } from '@nestjs/common';
import { FlyStatusNotifierService } from './fly-status-notifier.service';
import { FlyStatusNotifierController } from './fly-status-notifier.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs'

@Module({
  imports:[
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'FLY-STATUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fly-status',
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
            groupId: 'fly-status-producer'
          }
        }
      },
  ],),
  ],
  providers: [FlyStatusNotifierService],
  controllers: [FlyStatusNotifierController],
  exports:[FlyStatusNotifierService]
})
export class FlyStatusNotifierModule {}
