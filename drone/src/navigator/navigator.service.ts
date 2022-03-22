import { DeliveryStatus } from './../enum/delivery-status.enum';
import { ClientKafka } from '@nestjs/microservices';
import { PositionNotifierService } from 'src/position-notifier/position-notifier.service';
import { Injectable, Logger } from '@nestjs/common';
import { Position } from 'src/dto/position.dto';
import { Cron ,CronExpression, Interval} from '@nestjs/schedule';
import { FlyStatusNotifierService } from 'src/fly-status-notifier/fly-status-notifier.service';

@Injectable()
export class NavigatorService {

    private readonly logger = new Logger(NavigatorService.name);


    currentPosition : Position= new Position(0,0);
    currentIndex = 0; //etape de l'itinéraire
    itinerary : Array<Position> = []
    droneId=-1;
    idRequested = false;
    distBySec = 0.01;
    step = 3 //plus le chiffre est petit plus le drone est rapide
    distLat : number;
    distLong : number;
    counter :number =0;


    status: DeliveryStatus
    constructor( private flyStatusNotifierService : FlyStatusNotifierService,private positionNotifierService : PositionNotifierService,) {
        this.status=DeliveryStatus.GROUNDBASED
    }

    isCommandAffectToThisDrone(id:string){
        return this.droneId == parseInt(id)
    }
    initItinerary(droneItinerary : Array<Position>, clientStatus){
        this.currentPosition = new Position(0,0);
        this.currentIndex=0;
        this.itinerary = droneItinerary;
        this.calculNewStep(droneItinerary, this.currentPosition, this.step, this.currentIndex);
        this.changedStatus(clientStatus, DeliveryStatus.FLY)
    }

    initOrder(orderId : number,clientStatus){
        //this.changedStatus(clientStatus, DeliveryStatus.STARTING)
        this.flyStatusNotifierService.currentOrderId=orderId
    }

    changedStatus(clientStatus : ClientKafka, status : DeliveryStatus){
        this.flyStatusNotifierService.sendDeliveryStatusToServer(clientStatus, this.droneId,status, new Date(this.getDateString(Date.now())),this.currentPosition);
        this.status=status
    }

    calculNewStep(itinerary : Array<Position>, currentPos : Position, step : number, nextIndex:number){

        if(itinerary[nextIndex].latitude*currentPos.latitude>0){
            this.distLat = Math.abs((Math.abs(itinerary[nextIndex].latitude)-Math.abs(currentPos.latitude)));
        }
       
        else{
            this.distLat = Math.abs((itinerary[nextIndex].latitude-currentPos.latitude));
        }
        if(itinerary[nextIndex].longitude*currentPos.longitude<0){
            this.distLong = Math.abs((Math.abs(itinerary[nextIndex].longitude)-Math.abs(currentPos.longitude)));
        }
        else{
            this.distLong = Math.abs((itinerary[nextIndex].longitude-currentPos.longitude));
        }

        this.step = Math.ceil((this.distLat+this.distLong)/(this.distBySec))
        const somme = this.distLat+this.distLong
        this.distLat = (this.distLat * this.distBySec)/(somme);
        this.distLong = (this.distLong * this.distBySec)/(somme);


        if(currentPos.latitude>itinerary[this.currentIndex].latitude){
            this.distLat= (-1)*this.distLat
        }
        if(currentPos.longitude>itinerary[this.currentIndex].longitude){
            this.distLong= (-1)*this.distLong
        }


    }
    
    calculateMove(pos : Position, lat : number, long : number)  :Position{
        return new Position(pos.latitude+lat, pos.longitude+long)
    }

    async droneReady( clientStatus: ClientKafka){
        let id = await clientStatus.send('status.ready', {droneId: this.droneId})
        id.subscribe((res)=>{
            if(res!=null){
                this.droneId=res;
                this.positionNotifierService.sendPositionToServer(clientStatus,this.currentPosition,this.droneId,new Date(this.getDateString(Date.now())))
                this.changedStatus(clientStatus, DeliveryStatus.GROUNDBASED)

            }
        })
    }
    async action(clientPosition : ClientKafka, clientStatus: ClientKafka) {
        if((this.droneId==-1||this.droneId==null) && !this.idRequested){
            this.droneReady(clientStatus)
        }
        else{
            if(this.status == DeliveryStatus.FLY){//si itineraire
                if(this.counter==this.step){//realise une etape en n fois
                    this.counter=0;
                    this.currentIndex++;
                    if(this.currentIndex<this.itinerary.length){//calcule nouvelle etape
                        this.calculNewStep(this.itinerary, this.currentPosition, this.step,this.currentIndex);
                    }
                    else{//sinon arrivé
                        this.arrivedTodDestination(clientStatus)
                    }
                }
                this.move(clientPosition)
            }
            else if(this.status == DeliveryStatus.BACK){
                if(this.counter==this.step){
                    this.reset();
                    this.droneReady(clientStatus)
                    this.changedStatus(clientStatus, DeliveryStatus.GROUNDBASED)
                }
                else{
                    this.move(clientPosition)
                }
    
            }
            else{//n'a pas d'itineraire
                console.log("drone : "+this.droneId+" ready to fly | waiting for itinerary")
            }
        }
        
    }


    move(clientPosition : ClientKafka){
        this.currentPosition = this.calculateMove(this.currentPosition, this.distLat, this.distLong); //avance
        this.positionNotifierService.sendPositionToServer(clientPosition, this.currentPosition, this.droneId,new Date(this.getDateString(Date.now())));
        console.log(this.currentPosition)
        this.counter++;
    }

    arrivedTodDestination(clientStatus:ClientKafka){
        console.log("arrive")
        this.flyStatusNotifierService.sendDeliveryStatusToServer(clientStatus, this.droneId, DeliveryStatus.DELIVERED,new Date(this.getDateString(Date.now())),this.currentPosition);
        this.status=DeliveryStatus.DELIVERED
        this.goBack(clientStatus);
        
    }
    goBack(flyStatus){
        this.reset();
        this.changedStatus(flyStatus, DeliveryStatus.BACK)
        //this.droneReady(flyStatus);
        this.itinerary = []
        this.itinerary.push(new Position(0,0))
        this.calculNewStep(this.itinerary , this.currentPosition, this.step, 0);
    }
    
    reset(){
        this.itinerary=null
        this.currentIndex = 0;
        this.distLat=null;
        this.distLong=null;
        this.counter=0;
    }

    private getDateString(date: number): string {
        return this.format(new Date(date).toLocaleString('en-US', {
          timeZone: 'Europe/Berlin',
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }));
      }
    
      /**
     * format to yyyy-MM-ddThh:mm:ss
     * @param dateString dd/mm/yyyy, hh:mm:ss
     */
      private format(dateString: string): string {
        var strings: string[] = dateString.split(', ');
        var date: string[] = strings[0].split('/');
    
        return date[2] + '-' + date[0] + '-' + date[1] + 'T' + strings[1];
      }
    
}


