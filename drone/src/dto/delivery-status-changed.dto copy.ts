import { DeliveryStatus } from './../enum/delivery-status.enum';
import { Position } from "./position.dto";

export class DeliveryStatusChangedDto {
    readonly droneId: number;
    readonly timestamp: Date;
    readonly orderId : number;
    readonly deliveryStatus : DeliveryStatus
    readonly position: Position

    public constructor(droneId: number, timestamp: Date,orderId : number, deliveryStatus: DeliveryStatus,position: Position) {
        this.droneId = droneId;
        this.timestamp = timestamp;
        this.orderId = orderId;
        this.deliveryStatus = deliveryStatus;
        this.position = position;
    }
}