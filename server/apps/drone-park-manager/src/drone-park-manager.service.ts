//import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
//import { firstValueFrom, last, map } from 'rxjs';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { DroneStatusDto } from './dto/drone-status.dto';
import { DroneStatusEnum } from './dto/drone-status-enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { DroneStatus, DroneStatusDocument } from './schemas/drone-status.schema';
import { Position } from './dto/position.dto';
import { DronePositionChangedDto } from './dto/drone-position-changed.dto';

@Injectable()
export class DroneParkManagerService {
  constructor(private readonly httpService:HttpService, @InjectModel(DroneStatus.name) private DroneStatusModel: Model<DroneStatusDocument>) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createDroneStatus(droneStatusDto: DroneStatusDto): Promise<DroneStatus> {
    const createdDroneStatus = new this.DroneStatusModel(droneStatusDto);
    return createdDroneStatus.save();
  }

  async getCurrentDroneStatusById(droneId : string)
  {
    const Delivery = await this.DroneStatusModel.findOne({
      "droneId": droneId,
      sort: { "timestamp" : -1}}).exec()
    return Delivery;
  }

  
  async postDroneAvailable(droneId: any) {
    const deliveryPlannuerUrl ="http://delivery-planner:4005/available-drone/"
    const posWarehouse =new Position(0,0)
    const droneReady = {
      timestamp: new Date(Date.now()),
      droneId : droneId,
      droneStatus : DroneStatusEnum.READY,
    }
    this.createDroneStatus(droneReady)
    const res = new DronePositionChangedDto(droneId,new Date(Date.now()),posWarehouse)
    const response$ = this.callDeliveryPlanner(deliveryPlannuerUrl, res);
    console.log("droneAvailableSend"+droneId)
  return droneId//await firstValueFrom(response$);
  }

  async callDeliveryPlanner(deliveryPlannuerUrl: string, body){
    return this.httpService.post(deliveryPlannuerUrl,body).pipe(
      map(response => response.data)
    );
  }

  async getNewId(){

    const lastDroneAdded:DroneStatus[] = await this.DroneStatusModel.find().sort({droneId:-1}).limit(1).exec()//this.droneList.length;
    const newId:number =  lastDroneAdded.length!=0? parseInt(lastDroneAdded[0].droneId) + 1:0
    //this.droneList.push(newId);
    await new this.DroneStatusModel({
      "timestamp": new Date(Date.now()),
      "droneId" : newId,
      "droneStatus" : DroneStatusEnum.READY,
    }).save();

    return newId;
  }

  async getPositionForAvailableDrone(){
    //take only drone with status ready
    let val = await this.DroneStatusModel.aggregate([
    {$group:{
      "_id": "$droneId",
      timestamp :{'$last':"$timestamp"},
      droneStatus : {'$last':"$droneStatus"},
    }},
    {$sort: {
      'timestamp': -1
  }},
  {$match: {
    droneStatus:"READY"
  }},
    ]);
    const droneListId : string[] = [];
    if(val.length==0){
      return [] 
    }
    for(let i =0;i<val.length;i++){
      droneListId.push(val[i]._id)
    }
    const dronePosUrl ="http://drone-position:3000/position/latest?droneIds=["+ droneListId.toString()+"]"
    const response$ = this.httpService.get(dronePosUrl).pipe(
        map(response => response.data)
      )
    const res = await firstValueFrom(response$);
    console.log(res)
    return res;
  }

  async getLastId(){
    return this.DroneStatusModel.find().sort({"_id" : -1}).limit(1)
  }
  
}
