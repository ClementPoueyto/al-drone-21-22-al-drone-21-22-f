import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PositionAlertListenerService } from './position-alert-listener.service';

@Controller()
export class PositionAlertListenerController {
  constructor(private readonly positionAlertListenerService: PositionAlertListenerService) {}

  @Get()
  getHello(): string {
    return this.positionAlertListenerService.getHello();
  }

  @MessagePattern('inconsistent.position.detected')
  alertBadPosition(@Payload() message){
    console.log("Bad position detected for"+ JSON.stringify(message.value))
  }
}
