import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DronePositionChangedDto } from './dto/drone-position-changed.dto';
import { Position } from './dto/position.dto';
import { TimedPositionDto } from './dto/timed-position.dto';
import { PositionChanged, PositionChangedDocument } from './schemas/position-changed.schema';

@Injectable()
export class DronePositionService {

  constructor(@InjectModel(PositionChanged.name) private positionChangedModel: Model<PositionChangedDocument>) { }

  async store(positionChanged: DronePositionChangedDto) {
    const posChanged = new this.positionChangedModel(positionChanged);
    return posChanged.save();
  }

  async getLatestPosition(droneIds: number[]): Promise<Record<number, Position | null>> {
    // get for each id the latest position from DB
    let positionById: Record<number, Position | null> = {}

    for (let i = 0; i < droneIds.length; i++) {
      let positionChanged = await this.positionChangedModel.find({ droneId: droneIds[i] }).sort({ '_id': -1 }).limit(1).exec()
      positionChanged.length > 0 ? positionById[droneIds[i]] = positionChanged[0].position : positionById[droneIds[i]] = null;
    }

    return positionById;
  }

  async getLatestMinutePosition(droneId) {

  }

  async getPositionBetweenDates(droneIds: number[], begDate: Date, endDate: Date): Promise<Record<number, TimedPositionDto[] | null>> {
    // get for each id the positions between dates from DB
    let timedPositionsById: Record<number, TimedPositionDto[] | null> = {};

    for (let i = 0; i < droneIds.length; i++) {
      let positions = await this.positionChangedModel.find({ droneId: droneIds[i], timestamp: { $gte: begDate, $lt: endDate } }).exec();
      let timedPositions: TimedPositionDto[] = [];

      positions.forEach((pos) => {
        timedPositions.push(new TimedPositionDto(pos.timestamp, pos.position));
      });

      timedPositions.length > 0 ? timedPositionsById[droneIds[i]] = timedPositions : timedPositionsById[droneIds[i]] = null;
    }

    return timedPositionsById;
  }

  async getPositionsBetweenDatesOneDrone(droneId: number, begDate: Date, endDate: Date): Promise<Record<number, TimedPositionDto[] | null>> {
    // get for each id the positions between dates from DB
    let timedPositionsById: Record<number, TimedPositionDto[] | null> = {};
    console.log(droneId)
    console.log(begDate)
    console.log(endDate)

    let positions = await this.positionChangedModel.find({ droneId: droneId, timestamp: { $gte: begDate, $lt: endDate } }).exec();
    let timedPositions: TimedPositionDto[] = [];

    positions.forEach((pos) => {
      timedPositions.push(new TimedPositionDto(pos.timestamp, pos.position));
    });

    timedPositions.length > 0 ? timedPositionsById[droneId] = timedPositions : timedPositionsById[droneId] = null;


    return timedPositionsById;
  }

  async isValidPosition(positionChanged: DronePositionChangedDto) {
    let posDic = await this.getLatestPosition([positionChanged.droneId]);
    let latestPos = posDic[Object.keys(posDic)[0]];
    if (latestPos === null)
      return true;
    return this.distance(positionChanged.position.latitude, positionChanged.position.longitude, latestPos.latitude, latestPos.longitude) <= 3;
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
   */
  distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2 - lat1);
    var dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

}
