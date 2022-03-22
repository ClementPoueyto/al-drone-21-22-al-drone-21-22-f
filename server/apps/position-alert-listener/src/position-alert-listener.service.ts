import { Injectable } from '@nestjs/common';

@Injectable()
export class PositionAlertListenerService {
  getHello(): string {
    return 'Hello World!';
  }
}
