import { PositionNotifierService } from './position-notifier.service';
import { Controller, Inject, Get, Query } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Position } from 'src/dto/position.dto';

@Controller('position-notifier')
export class PositionNotifierController {
    constructor(@Inject('DRONE-POSITION') private readonly client: ClientKafka, 
    private readonly positionNotifierService: PositionNotifierService
    ) {}

    @Get()
    sendPositionToServer(@Query('latitude') lat:number, @Query('longitude') long :number, @Query('droneId') droneId : number, @Query('date') timestamp : Date){
      return this.positionNotifierService.sendPositionToServer(this.client, new Position(lat,long), droneId, timestamp);
    }
}
