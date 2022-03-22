import { NavigatorService } from './navigator.service';
import { Body, Controller, Inject, Logger, OnModuleDestroy, OnModuleInit, Post } from '@nestjs/common';
import { Position } from 'src/dto/position.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Interval } from '@nestjs/schedule';

@Controller('navigator')
export class NavigatorController implements OnModuleInit, OnModuleDestroy {
    constructor(@Inject('DRONE-POSITION') private readonly client: ClientKafka, 
    @Inject('FLY-STATUS') private readonly clientStatus: ClientKafka,
    private readonly navigatorService: NavigatorService
    ) {}

    async onModuleInit() {
      this.clientStatus.subscribeToResponseOf('status.ready');
      await this.clientStatus.connect();
      await this.client.connect();

    }
    
    async onModuleDestroy() {
      await this.client.close();
    }

    @Post()
    getItinerary(@Body() itinerary:Position[]){
      return itinerary
    }

    @MessagePattern('planning.update')
      async planningUpdated(@Payload() message) {
      let array:Array<Position>=[]
      if(this.navigatorService.isCommandAffectToThisDrone(message.value.droneId)){
        message.value.itinerary.forEach(pos => {
          array.push(new Position((Number)(pos.latitude),(Number)(pos.longitude)))
        });
        this.navigatorService.initOrder(message.value.orderId,this.clientStatus)
        this.navigatorService.initItinerary(array, this.clientStatus);
      }
    }

    @Interval(1000)
    action(){
      this.navigatorService.action(this.client, this.clientStatus);
    }

    
}
