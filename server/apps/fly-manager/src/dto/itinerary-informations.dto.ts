import { Position } from "./position.dto";

export class ItineraryInformationsDto {
    readonly droneId: number;
    readonly orderId: number;
    readonly departure: Position;
    readonly arrival: Position;

    constructor(object: any) {
        this.droneId = object.droneId;
        this.orderId = object.orderId;
        this.departure = object.departure;
        this.arrival = object.arrival;
    }
}