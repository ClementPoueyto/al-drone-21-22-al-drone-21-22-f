import { Position } from "./position.dto";

export class ItineraryInformationsDto {
    readonly droneId: number;
    readonly orderId: string;
    readonly departure: Position;
    readonly arrival: Position;

    constructor(droneId: number, orderId: string, departure: Position, arrival: Position) {
        this.droneId = droneId;
        this.orderId = orderId;
        this.departure = departure;
        this.arrival = arrival;
    }
}