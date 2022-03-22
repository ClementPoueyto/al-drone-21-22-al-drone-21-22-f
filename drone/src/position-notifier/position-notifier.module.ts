
import { Module } from '@nestjs/common';
import { PositionNotifierService } from './position-notifier.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PositionNotifierController } from './position-notifier.controller';
import { ConfigModule } from '@nestjs/config';
import { NavigatorModule } from 'src/navigator/navigator.module';
import * as fs from 'fs'

@Module({
  imports:[ ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'DRONE-POSITION',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'position-notifier',
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
            groupId: 'position-notifier-consumer'
          }
        }
      },
  ],),
     ],
  providers: [PositionNotifierService],
  controllers: [PositionNotifierController],
  exports:[PositionNotifierService],

})
export class PositionNotifierModule {}
