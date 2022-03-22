import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessageDto } from './dto/message.dto';
import { KafkaMessageProducerService } from './kafka-message-producer.service';

@Controller()
export class KafkaMessageProducerController {
  constructor(@Inject('MESSAGE_PRODUCER_SERVICE') private readonly client: ClientKafka, private readonly kafkaMessageProducerService: KafkaMessageProducerService) { }

  @Post()
  produceMessage(@Body() body: MessageDto): void {
    console.log("received: topic=" + body.topic + " body=" + body.message);
    this.client.emit(body.topic, JSON.stringify(body.message));
    console.log("sent: topic=" + body.topic + " body=" + JSON.stringify(body.message));
  }
}
