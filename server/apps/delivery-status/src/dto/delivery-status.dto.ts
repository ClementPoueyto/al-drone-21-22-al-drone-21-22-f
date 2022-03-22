import {DeliveryStatusReceivedDto} from "./delivery-status-received.dto";
import { Position } from "./position.dto";
export class DeliveryStatusDto {
    readonly id: number;
    readonly timestamp: Date;
    readonly orderId: string;
    readonly droneId : string;
    readonly position : Position;
    readonly deliveryStatus : string;
//,  status:string, deliveryId:number
  /*  constructor(dronePosition:DronePositionReceivedDto) {
        //  this.deliveryId=deliveryId;
        this.droneId=dronePosition.droneId;
        this.position=dronePosition.position;
        //  this.status=status;
        this.timestamp=dronePosition.timestamp;
    }*/
    constructor(deliveryStatus:DeliveryStatusReceivedDto) {
        this.orderId=deliveryStatus.orderId;
        this.droneId=deliveryStatus.droneId;
        this.deliveryStatus=deliveryStatus.deliveryStatus;
        this.timestamp=deliveryStatus.timestamp;
    }
}