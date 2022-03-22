import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type DroneStatusDocument = DroneStatus & Document;

@Schema()
export class DroneStatus {
    @Prop({ required: true })
    droneId: string;

    @Prop({ required: true, type:Date })
    timestamp: Date;

    @Prop({ required:true })
    droneStatus:string;

}

export const DroneStatusSchema = SchemaFactory.createForClass(DroneStatus);
