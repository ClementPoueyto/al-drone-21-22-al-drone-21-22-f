import { Position } from "./position.dto";

export class DronePositionChangedDto {
    readonly droneId: number;
    readonly timestamp: Date;
    readonly position: Position;

    public constructor(droneId: number, timestamp: Date, position: Position) {
        this.droneId = droneId;
        this.timestamp = timestamp;
        this.position = position;
    }
}