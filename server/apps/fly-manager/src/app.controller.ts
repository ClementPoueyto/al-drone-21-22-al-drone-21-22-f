import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { DroneItinerary } from './dto/drone-itinerary.dto';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { ItineraryInformationsDto } from './dto/itinerary-informations.dto';

@Controller()
export class AppController {
  constructor(@Inject('FLY_MANAGER') private readonly client: ClientKafka, private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async setItinerary(@Body() infos: ItineraryInformationsDto) {
    //console.log(infos)
    let droneItinerary = new DroneItinerary(
      infos.droneId,
      this.appService.findBestItinerary(infos.departure, infos.arrival),
      infos.orderId
    );
    //console.log(droneItinerary);
    this.client.emit('planning.update', JSON.stringify(
      droneItinerary
    ));
  }

}
