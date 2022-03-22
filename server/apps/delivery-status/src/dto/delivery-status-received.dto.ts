export class DeliveryStatusReceivedDto {
    readonly id: number;
    readonly timestamp: Date;
    readonly orderId: string;
    readonly droneId : string;
    readonly deliveryStatus : string;

    constructor(deliveryId:string,droneId:string,status:string, timestamp:Date) {
        this.orderId=deliveryId;
        this.droneId=droneId;
        this.deliveryStatus=status;
        this.timestamp=timestamp;
    }
}