import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { DronePositionController } from './drone-position.controller';
import { DronePositionService } from './drone-position.service';
import { PositionChanged, PositionChangedSchema } from './schemas/position-changed.schema';
import * as fs from 'fs';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([{
      name: PositionChanged.name,
      schema: PositionChangedSchema
     
    }]),
    ClientsModule.register([
      {
        name: 'DRONE_POSITION',
        transport: Transport.KAFKA,
        options: {

          client: {
            clientId: 'drone-position',
            brokers: [process.env.KAFKA_URL1,process.env.KAFKA_URL2,process.env.KAFKA_URL3],
            connectionTimeout: 8000,
            retry: {
              initialRetryTime: 300,
              retries: 8
            },            ssl: {
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
        }
      },
    ])
  ],
  controllers: [DronePositionController],
  providers: [DronePositionService],
})
export class DronePositionModule { }
