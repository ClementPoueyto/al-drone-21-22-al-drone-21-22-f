import { NestFactory } from '@nestjs/core';
import { KafkaMessageProducerModule } from './kafka-message-producer.module';

async function bootstrap() {
  const app = await NestFactory.create(KafkaMessageProducerModule);
  await app.listen(4006);
}
bootstrap();
