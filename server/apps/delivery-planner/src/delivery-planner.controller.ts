import { Controller, Get, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { DeliveryPlannerService } from './delivery-planner.service';
import { Command } from './dto/command.dto';
import { DronePositionChangedDto } from './dto/drone-position-changed.dto';

@Controller()
export class DeliveryPlannerController {
  constructor(private readonly deliveryPlannerService: DeliveryPlannerService) {}


  @Post("command")
  getNewCommand(@Body() command:Command){
      return this.deliveryPlannerService.affectCommandToDrone(command)

  }

  @Post('available-drone')
  postNewDroneAvailble(@Body() drone:DronePositionChangedDto){
    return this.deliveryPlannerService.newDroneAvailable(drone)
  }
}
