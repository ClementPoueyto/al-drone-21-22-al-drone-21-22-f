import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { firstValueFrom, map, zip } from 'rxjs';
import { Command } from '../dto/command.dto';
import { ApiGatewayService } from './api-gateway.service';

@Controller('api')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService,private readonly httpService:HttpService ) {}

  deliveryStatusUrl ="http://delivery-status:3002/delivery-status/"
  dronePositionUrl ="http://drone-position:3000/position/"
  deliveryPlannerUrl ="http://delivery-planner:4005/command/"

  @Get('/position/latest')
  async getPosition(@Query('droneIds') droneIds: string): Promise<any>{
     return this.httpService.get(this.dronePositionUrl+"latest?droneIds="+droneIds).pipe(
      map(response => response.data)
    )
     

  }

  @Get('position/history')
  async getPositionBetweenDates(@Query('droneId') droneId: number, @Query('droneIds') droneIds: string, @Query('begDate') begDate: Date, @Query('endDate') endDate: Date) {
    let params = "begDate="+begDate+"&endDate="+endDate;
    if(begDate!=null && endDate !=null && droneIds!=null){
      params = params + "&droneIds="+droneIds;
      return this.httpService.get(this.dronePositionUrl+"history?"+params).pipe(
        map(response => response.data)
      );
    }
    if(begDate!=null && endDate !=null && droneId!=null){
      params = params+ "&droneId="+droneId;
      return this.httpService.get(this.dronePositionUrl+"history?"+params).pipe(
        map(response => response.data)
      );
    }
     
  }


  @Get("delivery-status")
  async getDeliveryStatusByDeliveryId(@Query('orderId') orderId: string) {
    return this.httpService.get(this.deliveryStatusUrl+"?orderId"+orderId).pipe(
      map(response => response.data)
    );  
  }


  @Get('delivery-status/status')
  GetAllDroneStatus() {
    return this.httpService.get(this.deliveryStatusUrl+"status").pipe(
      map(response => response.data)
    );  
  }

  @Post("command")
  postNewCommand(@Body() command:Command){
    return this.httpService.post(this.deliveryPlannerUrl, command).pipe(
      map(response => response.data)
    );    }
}
