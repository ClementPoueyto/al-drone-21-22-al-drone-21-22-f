import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaMessageProducerService {
  getHello(): string {
    return 'Hello World!';
  }
}
