import { Controller, Get, Inject, Query } from '@nestjs/common';
import { DronePositionService } from './drone-position.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DronePositionChangedDto } from './dto/drone-position-changed.dto';
import { delay, of } from 'rxjs';

@Controller()
export class DronePositionController {
  constructor(private readonly dronePositionService: DronePositionService, @Inject('DRONE_POSITION') private readonly client: ClientKafka) { }

  @MessagePattern('position.changed')
  async positionChanged(@Payload() message) {
    let positionChanged = new DronePositionChangedDto(message.value.droneId, message.value.timestamp, message.value.position);
    if (await this.dronePositionService.isValidPosition(positionChanged) === true)
      this.dronePositionService.store(positionChanged);
    else {
      console.log("inconsistent.position.detected"+ JSON.stringify(positionChanged))
      this.client.emit('inconsistent.position.detected', JSON.stringify(positionChanged));
    }
  }

  @Get('position/latest')
  async getPosition(@Query('droneIds') droneIds: string) {
    return this.dronePositionService.getLatestPosition(JSON.parse(droneIds));
  }

  @Get('position/latestminute')
  async getPositionLatestMinute(@Query('droneId') droneId: number) {
    return this.dronePositionService.getLatestMinutePosition(droneId);
  }

  @Get('position/history')
  async getPositionBetweenDates(@Query('droneId') droneId: number, @Query('droneIds') droneIds: string, @Query('begDate') begDate: Date, @Query('endDate') endDate: Date) {
    if (droneId != null) {
      return this.dronePositionService.getPositionsBetweenDatesOneDrone(droneId, begDate, endDate);
    }

    return this.dronePositionService.getPositionBetweenDates(JSON.parse(droneIds), begDate, endDate);
  }



}
