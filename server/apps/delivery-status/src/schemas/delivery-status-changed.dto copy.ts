import { Prop, Schema } from '@nestjs/mongoose';
import { DeliveryStatus } from './delivery-status.schemas';

export type DeliveryStatusChangedDocument = DeliveryStatusChanged & Document;

@Schema()
export class DeliveryStatusChanged {
    @Prop({ required: true })
    droneId: number;
    @Prop({ required: true })
    timestamp: Date;
    @Prop({ required: true })
    orderId : number;
    @Prop({ required: true })
    deliveryStatus : DeliveryStatus

    public constructor(droneId: number, timestamp: Date,orderId : number, deliveryStatus: DeliveryStatus) {
        this.droneId = droneId;
        this.timestamp = timestamp;
        this.orderId = orderId;
        this.deliveryStatus = deliveryStatus;
    }
}