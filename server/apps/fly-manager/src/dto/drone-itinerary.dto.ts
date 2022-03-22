import { Position } from "./position.dto";

export class DroneItinerary {
    readonly droneId: number;
    readonly itinerary: Position[];
    readonly orderId: number;

    constructor(droneId: number, itinerary: Position[], orderId: number) {
        this.droneId = droneId;
        this.itinerary = itinerary;
        this.orderId = orderId;
    }
}