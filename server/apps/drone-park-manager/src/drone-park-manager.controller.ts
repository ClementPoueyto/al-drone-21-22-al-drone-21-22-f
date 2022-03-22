import { Body, Controller, Get, Post } from '@nestjs/common';
import { DroneParkManagerService } from './drone-park-manager.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DroneParkManagerController {
  constructor(private readonly droneParkManagerService: DroneParkManagerService) {}

  @Get()
  getHello(): string {
    return this.droneParkManagerService.getHello();
  }

  
  @MessagePattern('status.ready')
  getDroneReady(@Payload() message){
    console.log(message)
    if(message.value.droneId==-1){
      return this.droneParkManagerService.getNewId()
    }else{
      
      return this.droneParkManagerService.postDroneAvailable(message.value.droneId) 
    }
  }

  @Post("drone-started")
  postDroneStarted(@Body() droneStatus){
    
    return this.droneParkManagerService.createDroneStatus(droneStatus)
  }
  
  @Get("positions/available")
  getPositionForAvailableDrone(){
    return this.droneParkManagerService.getPositionForAvailableDrone()
  }

  @Post("status")
  postStatusDrone(@Body() droneStatus){
    return this.droneParkManagerService.createDroneStatus(droneStatus)
  }

  @Get("newid")
  newId(){
    return this.droneParkManagerService.getNewId()
  }

  @Get("lastid")
  lastId(){
    return this.droneParkManagerService.getLastId()
  }
}
