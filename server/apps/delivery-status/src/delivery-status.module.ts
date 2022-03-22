
import { Module } from '@nestjs/common';
import { DeliveryStatusController } from './delivery-status.controller';
import { DeliveryStatusService } from './delivery-status.service';
import {MongooseModule} from "@nestjs/mongoose";
import { HttpModule } from '@nestjs/axios';
import { DeliveryStatus, DeliveryStatusDocument, DeliveryStatusSchema } from './schemas/delivery-status.schemas';
@Module({
  imports: [HttpModule,
    MongooseModule.forRoot(process.env.DB_URL?process.env.DB_URL:'mongodb://localhost:27017'),
    MongooseModule.forFeatureAsync([{
      name: DeliveryStatus.name,
      useFactory: () => {
        const schema = DeliveryStatusSchema;
        schema.post('save', function (createdDeliveryStatus: DeliveryStatusDocument) {
          console.log('DeliveryStatus saved: | %s | %d | %d | (%d,%d) | %s ', createdDeliveryStatus.timestamp, createdDeliveryStatus.droneId, createdDeliveryStatus.orderId, createdDeliveryStatus.position.latitude,createdDeliveryStatus.position.longitude, createdDeliveryStatus.deliveryStatus)
        });
        return schema;
      }
    }])],
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusService],
})
export class DeliveryStatusModule {}
