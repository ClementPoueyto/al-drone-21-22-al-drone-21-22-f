import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { Position } from '../dto/position.dto';

export type DeliveryStatusDocument = DeliveryStatus & Document;

@Schema()
export class DeliveryStatus {
    @Prop({ required: true })
    orderId: string;

    @Prop({ required: true, type:Date })
    timestamp: Date;

    @Prop({ required:true })
    droneId:string;

    @Prop()
    position:Position;

    @Prop({ required:true })
    deliveryStatus:string;

}

export const DeliveryStatusSchema = SchemaFactory.createForClass(DeliveryStatus);