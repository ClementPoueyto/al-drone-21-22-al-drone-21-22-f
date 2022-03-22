import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Position } from './dto/position.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @MessagePattern('planning.update')
  async planningUpdated(@Payload() message) {
    console.log(message) 
  }
}
