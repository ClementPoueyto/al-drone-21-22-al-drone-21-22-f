import { DeliveryStatus } from './../enum/delivery-status.enum';
import { FlyStatusNotifierService } from './fly-status-notifier.service';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Position } from 'src/dto/position.dto';

@Controller('fly-status-notifier')
export class FlyStatusNotifierController {
    constructor(@Inject('FLY-STATUS') private readonly client: ClientKafka, private readonly flyStatusNotifierService: FlyStatusNotifierService
    ) {}

    @Get()
    sendDeliveryStatusToServer(@Query('droneId') droneId: number,@Query('status') status: DeliveryStatus, @Query('date') timestamp  :Date, @Query('position') position : Position){
      return this.flyStatusNotifierService.sendDeliveryStatusToServer(this.client, droneId, status, timestamp,position);
    }
}
