import { Position } from "./position.dto";

export class DronePositionReceivedDto {
    readonly droneId: string;
    readonly timestamp: Date;
    readonly position: Position;

    public constructor(droneId: string, timestamp: Date, position: Position) {
        this.droneId = droneId;
        this.timestamp = timestamp;
        this.position = position;
    }
}