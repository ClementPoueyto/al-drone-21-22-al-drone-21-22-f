import { Module } from '@nestjs/common';
import { PositionAlertListenerController } from './position-alert-listener.controller';
import { PositionAlertListenerService } from './position-alert-listener.service';

@Module({
  imports: [],
  controllers: [PositionAlertListenerController],
  providers: [PositionAlertListenerService],
})
export class PositionAlertListenerModule {}
