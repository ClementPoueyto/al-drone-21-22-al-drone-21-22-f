import { Injectable } from '@nestjs/common';
import {DeliveryStatusDto} from "./dto/delivery-status.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {DeliveryStatusReceivedDto} from "./dto/delivery-status-received.dto";
import {DronePositionReceivedDto} from "./dto/drone-position-received.dto";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DeliveryStatus, DeliveryStatusDocument } from './schemas/delivery-status.schemas';


@Injectable()
export class DeliveryStatusService {
  constructor(private readonly httpService:HttpService, @InjectModel(DeliveryStatus.name) private DeliveryStatusModel: Model<DeliveryStatusDocument>) { }


  async createDeliveryStatus(deliveryStatusDto: DeliveryStatusDto): Promise<DeliveryStatus> {
    this.droneStartDelivering(deliveryStatusDto.droneId)
    const createdDeliveryStatus = new this.DeliveryStatusModel(deliveryStatusDto);
    return createdDeliveryStatus.save();
  }

  async getDeliveryStatusByDeliveryId(deliveryId : string)
  {
    const Delivery = await this.DeliveryStatusModel.findOne({ orderId : deliveryId }).exec()
    if(Delivery!=null)
      return Delivery;
    else
      return null
  }

  async getCurrentDeliveryId(droneId: string)
  {

    const Delivery = await this.DeliveryStatusModel.findOne({ droneId : droneId , deliveryStatus :'FLY'}).exec()
    const Delivery2 = await this.DeliveryStatusModel.findOne({ droneId : droneId , deliveryStatus :'GROUNDBASED'}).exec()
    const Delivery3 = await this.DeliveryStatusModel.findOne({ droneId : droneId , deliveryStatus :'STARTING'}).exec()

    return Delivery || Delivery2 || Delivery3 ;
  }

  async statusUpdated(deliveryStatusReceivedDto: DeliveryStatusReceivedDto)
  {
    const update={orderId : deliveryStatusReceivedDto.orderId, deliveryStatus: deliveryStatusReceivedDto.deliveryStatus }
    const Delivery = await this.DeliveryStatusModel.findOneAndUpdate({ orderId : deliveryStatusReceivedDto.orderId },update).exec()
    return Delivery;
  }
  async droneStartDelivering(droneId:string){
    const droneParkUrl ="http://drone-park-manager:4004/drone-started"
    const response$ = this.httpService.post(droneParkUrl,{
      "timestamp": new Date(Date.now()),
      "droneId" : droneId,
      "droneStatus" : "DELIVERING",
    })
    const res = await firstValueFrom(response$)
  }
  async positionUpdated(dronePositionReceivedDto: DronePositionReceivedDto)
  {
    const update={position : dronePositionReceivedDto.position}
      //, timestamp : dronePositionReceivedDto.timestamp}
    const delivery = await this.DeliveryStatusModel.findOneAndUpdate({ droneId : dronePositionReceivedDto.droneId, deliveryStatus: 'FLY'  },update).exec()

    return delivery;

   /* const delivery = await this.DeliveryStatusModel.findOne({ droneId : dronePositionReceivedDto.droneId }).exec()
  delivery.position=dronePositionReceivedDto.position
    return delivery.save()*/
  }
  async getAllDroneStatus() {

    const delivery= await this.DeliveryStatusModel.find().exec()
    return delivery.map(drone=>({
      droneId: drone.droneId,
      status : drone.deliveryStatus
    }));
  }

  async getLastOrder(){
    return await this.DeliveryStatusModel.find().sort({"orderId" : -1}).limit(1)
  }
}
