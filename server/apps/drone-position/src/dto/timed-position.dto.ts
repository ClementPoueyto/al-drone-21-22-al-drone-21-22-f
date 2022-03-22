import { Position } from "./position.dto";

export class TimedPositionDto {
    readonly timestamp: Date;
    readonly position: Position;

    constructor(timestamp: Date, position: Position) {
        this.timestamp = timestamp;
        this.position = position;
    }
}