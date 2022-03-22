import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type DroneRegisteredDocument = DroneRegistered & Document;

@Schema()
export class DroneRegistered {
    

    @Prop({ required:true })
    droneId:number;
/** to Add when deliveryStatus will be finished 
    @Prop({ required:true })
    deliveryStatus:string;
*/
}

export const DroneRegisteredSchema = SchemaFactory.createForClass(DroneRegistered);