import { PositionNotifierModule } from './../position-notifier/position-notifier.module';
import { FlyStatusNotifierModule } from './../fly-status-notifier/fly-status-notifier.module';
import { PositionNotifierService } from 'src/position-notifier/position-notifier.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NavigatorController } from './navigator.controller';
import { NavigatorService } from './navigator.service';
import { FlyStatusNotifierService } from 'src/fly-status-notifier/fly-status-notifier.service';
import * as fs from 'fs'

@Module({
  imports:[ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'DRONE-POSITION',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'drone-navigator',
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
            groupId: 'drone-navigator-consumer'
          }
        }
      },
      {
        name: 'FLY-STATUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fly-status-nav',
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
            groupId: 'fly-status-nav-producer',
          }
        }
      },
  ],),
  FlyStatusNotifierModule,
  PositionNotifierModule
],
  controllers: [NavigatorController],
  providers: [NavigatorService],
  exports:[NavigatorService]

})
export class NavigatorModule {}
