import { DeliveryStatusChangedDto } from './../dto/delivery-status-changed.dto copy';
import { DeliveryStatus } from './../enum/delivery-status.enum';
import { ClientKafka } from '@nestjs/microservices';
import { Injectable, Logger } from '@nestjs/common';
import { Position } from 'src/dto/position.dto';

@Injectable()
export class FlyStatusNotifierService {

    currentStatus : DeliveryStatus = DeliveryStatus.GROUNDBASED;
    currentOrderId : number;
    private readonly logger = new Logger(FlyStatusNotifierService.name);

    sendDeliveryStatusToServer(client : ClientKafka, droneId : number, status : DeliveryStatus, timestamp : Date,position:Position){
        this.currentStatus = DeliveryStatus[status];
        const changedStatus = new DeliveryStatusChangedDto(droneId, timestamp,this.currentOrderId,this.currentStatus,position);
        this.logger.debug(changedStatus.toString());
        client.emit('deliverystatus.changed', {key:droneId,value: JSON.stringify(changedStatus)});
        return  changedStatus;
    }

}
