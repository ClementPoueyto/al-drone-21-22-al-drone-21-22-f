import { Injectable } from '@nestjs/common';
import { Position } from './dto/position.dto';

@Injectable()
export class AppService {
  constructor() { }
  droneUrl = {
    "1": "http://localhost:4021"
  }
  getHello(): string {
    return 'Hello World!';
  }

  findBestItinerary(departure: Position, arrival: Position) {//the bestItinerary not calculate juste create complex itinerary randomly
    let stepLat: number = departure.latitude
    let stepLong: number = departure.longitude
    const itinerary: Position[] = []
    for (let val = 0; val < 4; val++) {
      stepLat = Math.random() * (arrival.latitude - stepLat) + stepLat
      stepLong = Math.random() * (arrival.longitude - stepLong) + stepLong
      itinerary.push(new Position(stepLat, stepLong))
    }
    itinerary.push(new Position(arrival.latitude, arrival.longitude))
    //console.log(itinerary)
    return itinerary
  }

}
