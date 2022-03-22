import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { DronePositionChangedDto } from 'src/dto/drone-position-changed.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Position } from 'src/dto/position.dto';

@Injectable()
export class PositionNotifierService {

    private readonly logger = new Logger(PositionNotifierService.name);

    

  
    getHello(): string {
      return 'Hello World!';
    }
    
   

    sendPositionToServer( client: ClientKafka, position:Position, droneId : number, timestamp : Date){
        const changedPos = new DronePositionChangedDto(droneId,timestamp,position);
        this.logger.debug(changedPos.toString());
        client.emit('position.changed', {key:droneId,value:JSON.stringify(changedPos)});
        return changedPos;
      //ssl
    }
  

  

}
