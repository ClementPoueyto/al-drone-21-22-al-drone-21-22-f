import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Position } from './position.schema';

export type PositionChangedDocument = PositionChanged & Document;

@Schema()
export class PositionChanged {
    @Prop({ required: true })
    droneId: number;

    @Prop({ required: true })
    timestamp: Date;

    @Prop({ required: true })
    position: Position;

    constructor(object) {
        this.droneId = object.droneId;
        this.timestamp = object.timestamp;
        this.position = object.position;
    }
}

export const PositionChangedSchema = SchemaFactory.createForClass(PositionChanged);