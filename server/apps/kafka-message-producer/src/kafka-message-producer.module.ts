import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaMessageProducerController } from './kafka-message-producer.controller';
import { KafkaMessageProducerService } from './kafka-message-producer.service';
import * as fs from 'fs'

@Module({
  imports: [ClientsModule.register([
    {
      name: 'MESSAGE_PRODUCER_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'message-producer',
          brokers: [process.env.KAFKA_URL1,process.env.KAFKA_URL2,process.env.KAFKA_URL3],
          connectionTimeout: 8000,
          retry: {
            initialRetryTime: 300,
            retries: 8
          },        },
        consumer: {
          groupId: 'message-producer-consumer'
        }
      }
    },
  ]),],
  controllers: [KafkaMessageProducerController],
  providers: [KafkaMessageProducerService],
})
export class KafkaMessageProducerModule { }
