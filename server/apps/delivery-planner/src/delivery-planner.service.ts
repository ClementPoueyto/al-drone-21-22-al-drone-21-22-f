import { CircuitBreaker } from './circuit-breaker/CircuitBreaker';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Command } from './dto/command.dto';
import { DronePositionChangedDto } from './dto/drone-position-changed.dto';
import { Position } from './dto/position.dto';

import { ItineraryInformationsDto } from './dto/itinerary-informations.dto';
import { BreakerOptions } from './circuit-breaker/BreakerOptions';
@Injectable()
export class DeliveryPlannerService {
  serviceCommand = null;
  commandNotAffect: Command[] = []
  droneParkUrl = "http://drone-park-manager:4004";
  flymanagerUrl = "http://fly-manager:4001";
  circuitBreakerDronePark = new CircuitBreaker({
    timeout : 1000,
    method: "get",
    url: this.droneParkUrl+"/positions/available"},   new BreakerOptions(2, 3, 10000));
  circuitBreakerItinerary = new CircuitBreaker({
    timeout : 1000,
    method: "post",
    url: this.flymanagerUrl},new BreakerOptions(2, 3, 10000));

  constructor(private readonly httpService: HttpService) {
  }
 


  async newDroneAvailable(drone: DronePositionChangedDto) {
    console.log("drone now Available" + drone.droneId)
    if (this.commandNotAffect.length > 0) {
      const commandToDeliver: Command = this.commandNotAffect.shift();
      this.sendInfos(drone, drone.position, commandToDeliver.deliveryPoint, commandToDeliver.orderId);
    }
  }


  async affectCommandToDrone(command: Command) {
    let availableDronePos;
    try{
      return availableDronePos = await this.getResourceDrones().then(async availableDronePos=>{
        if(availableDronePos){
          if(!availableDronePos){
            throw new Error()
          }
          if (availableDronePos==null||availableDronePos.length == 0) {
            this.commandNotAffect.push(command)
            return new HttpException("Pas de drone disponnible pour le moment", HttpStatus.BAD_REQUEST);
          }
          try{
  
            const droneChoose = this.nearestFromDeliverypoint(command.deliveryPoint, availableDronePos)
            console.log("Envoie des informations au drone n°"+droneChoose.droneId)
            await this.sendInfos(droneChoose, droneChoose.position, command.deliveryPoint, command.orderId)
            return droneChoose.droneId
          }
          catch(err){
            console.log(err)
            return new HttpException("service FlyManager non disponible", HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      });
    }
    catch(err){
      return new HttpException("service droneParkManager non disponible", HttpStatus.INTERNAL_SERVER_ERROR);

    }
    
    
  
  }

  private async sendInfos(droneChoose: DronePositionChangedDto, departure: Position, arrival: Position, orderId: string) {
    const res: ItineraryInformationsDto = new ItineraryInformationsDto(droneChoose.droneId, orderId, departure, arrival);
    const resPost$ = await this.sendPlanDrone(0, res);
    return resPost$
  }

  private nearestFromDeliverypoint(deliveryPoint: Position, dronePositions: any[]) {
    let res = undefined
    let minDist = Infinity
    Object.keys(dronePositions).forEach(val => {
      //console.log(dronePositions[val])
      let dist = this.distance(dronePositions[val], deliveryPoint)
      //console.log(val + "|" + dist)
      if (dist < minDist) {
        minDist = dist
        res = new DronePositionChangedDto(parseInt(val), new Date(Date.now()), dronePositions[val])
      }
    })
    return res;
  }

  distance(departure: Position, arrival: Position) {
    if (departure != undefined && departure.latitude != undefined)
      return Math.sqrt((arrival.latitude - departure.latitude) ** 2 + (arrival.longitude - departure.longitude) ** 2)
    return Infinity
  }

  delay(retryCount){
    console.log("RETRY -> TEMPS : "+4 ** retryCount)
  return new Promise(resolve => setTimeout(resolve, 4 ** retryCount));}

  async getResourceDrones(retryCount = 0){
    return this.apiDroneParkCall().catch(() => this.delay(retryCount).then(() => { 
      if(retryCount<8){
        return this.getResourceDrones(retryCount + 1)
      }
      else{
        throw new InternalServerErrorException("Service non disponible")
      }
    }));
  }

  async apiDroneParkCall(){
    return await this.circuitBreakerDronePark.exec();
  }

  async apiFlyCall(res){
    return await this.circuitBreakerItinerary.exec(res);
  }
  
  async sendPlanDrone(retryCount = 0, res){
      return this.apiFlyCall(res).catch(() => this.delay(retryCount).then(() => {
        if(retryCount<8){
          return this.sendPlanDrone(retryCount + 1,res);
        }
        else{
          throw new InternalServerErrorException("Service non disponible")
        }
      }))
    }
}


