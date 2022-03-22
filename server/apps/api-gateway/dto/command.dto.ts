import { Position } from "./position.dto"

export class Command {
    deliveryPoint:Position
    clientId: string
    deliveryDate : Date
    orderId:string
}