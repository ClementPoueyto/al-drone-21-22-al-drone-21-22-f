import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export class DroneRegisteredDto {
    @Prop({ required: true })
    readonly droneId: number;

    public constructor(droneId: number) {
        this.droneId = droneId;
    }
}