import { DroneStatusEnum } from "./drone-status-enum";

export class DroneStatusDto {
    readonly timestamp: Date;
    readonly droneId : string;
    readonly droneStatus : DroneStatusEnum;

    constructor(droneStatus:DroneStatusDto) {
        this.droneId=droneStatus.droneId;
        this.droneStatus=droneStatus.droneStatus;
        this.timestamp=droneStatus.timestamp;
    }


}