import { NestFactory } from '@nestjs/core';
import { DeliveryPlannerModule } from './delivery-planner.module';

async function bootstrap() {
  const app = await NestFactory.create(DeliveryPlannerModule);
  await app.listen(4005);
}
bootstrap();
