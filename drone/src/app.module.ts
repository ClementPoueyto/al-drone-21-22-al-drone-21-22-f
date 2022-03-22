import { NavigatorService } from './navigator/navigator.service';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { NavigatorModule } from './navigator/navigator.module';
import { PositionNotifierModule } from './position-notifier/position-notifier.module';
import { DtoModule } from './dto/dto.module';
import { FlyStatusNotifierModule } from './fly-status-notifier/fly-status-notifier.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(
  ),NavigatorModule, PositionNotifierModule, DtoModule, FlyStatusNotifierModule,ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
