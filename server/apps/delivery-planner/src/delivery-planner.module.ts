import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DeliveryPlannerController } from './delivery-planner.controller';
import { DeliveryPlannerService } from './delivery-planner.service';

@Module({
  imports: [HttpModule],
  controllers: [DeliveryPlannerController],
  providers: [DeliveryPlannerService],
})
export class DeliveryPlannerModule {}
