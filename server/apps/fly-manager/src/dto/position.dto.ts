export class Position {
  readonly latitude: number;
  readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  toString(){
    return "["+this.longitude+","+this.latitude+"]";
  }
}
