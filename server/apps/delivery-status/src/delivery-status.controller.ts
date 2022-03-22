import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { DeliveryStatusService } from './delivery-status.service';
import {DeliveryStatusDto} from "./dto/delivery-status.dto";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {DronePositionReceivedDto} from "./dto/drone-position-received.dto";
import {DeliveryStatusReceivedDto} from "./dto/delivery-status-received.dto";
import { delay, of } from 'rxjs';


@Controller()
export class DeliveryStatusController {
  constructor(private readonly deliveryStatusService: DeliveryStatusService) {}

  @MessagePattern('deliverystatus.changed')
  async statusReceived(@Payload() message) {
    const delivery=await this.deliveryStatusService.getDeliveryStatusByDeliveryId(message.value.orderId)
    let delivery_status_received=new DeliveryStatusReceivedDto(message.value.orderId,message.value.droneId,message.value.deliveryStatus,message.value.timestamp)
    if( delivery_status_received.deliveryStatus == 'FLY' && delivery==null){
      const val = await this.deliveryStatusService.createDeliveryStatus(new DeliveryStatusDto(delivery_status_received))
      console.log("create:"+JSON.stringify(val))
    }
    if(delivery_status_received.deliveryStatus == 'STARTING'||delivery_status_received.deliveryStatus == 'DELIVERED'){
      const val = await this.deliveryStatusService.statusUpdated(delivery_status_received);
      console.log("update:"+JSON.stringify(val))
    }
  }


  @MessagePattern('position.changed')
  async positionReceived(@Payload() message) {
    //console.log(message.value)

    //const delivery=await this.deliveryStatusService.getCurrentDeliveryId(message.value.droneId)
    const delivery=await this.deliveryStatusService.getCurrentDeliveryId(message.value.droneId)

    /*   if (delivery==null) {
         let delivery_status_received=new DeliveryStatusReceivedDto(message.value.orderId,message.value.droneId,"GROUNDBASED",message.value.timestamp)
         const deliverystatus=new DeliveryStatusDto(delivery_status_received)
         await this.deliveryStatusService.createDeliveryStatus(deliverystatus);
       }*/
    if(delivery!=null){
     // console.log(JSON.stringify(delivery))
      if (delivery.deliveryStatus == 'FLY' || delivery.deliveryStatus == 'STARTING') {

        let Position = new DronePositionReceivedDto(message.value.droneId, message.value.timestamp, message.value.position)
        console.log(JSON.stringify(Position))
        await this.deliveryStatusService.positionUpdated(Position)
      }
    }

  }


  @Post('delivery-status')
  async createDeliveryStatus(@Body() deliveryStatusDto: DeliveryStatusDto) {
    await this.deliveryStatusService.createDeliveryStatus(deliveryStatusDto);
  }


  @Get("delivery-status")
  async getDeliveryStatusByDeliveryId(@Query('orderId') orderId: string) {
    return this.deliveryStatusService.getDeliveryStatusByDeliveryId(orderId);
  }


  @Get('delivery-status/status')
  GetAllDroneStatus() {
    return this.deliveryStatusService.getAllDroneStatus();
  }

  @Get('delivery-status/lastorder')
  GetLastOrder() {
    return this.deliveryStatusService.getLastOrder();
  }

}
