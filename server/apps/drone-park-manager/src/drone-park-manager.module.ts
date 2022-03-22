import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DroneParkManagerController } from './drone-park-manager.controller';
import { DroneParkManagerService } from './drone-park-manager.service';
import { DroneStatus, DroneStatusSchema } from './schemas/drone-status.schema';

@Module({
  imports: [HttpModule,
    MongooseModule.forRoot(process.env.DB_URL?process.env.DB_URL:'mongodb://localhost:27017'),
    MongooseModule.forFeature([{
      name: DroneStatus.name,
      schema: DroneStatusSchema
    }]
    ),
  ],
  controllers: [DroneParkManagerController],
  providers: [DroneParkManagerService],
})
export class DroneParkManagerModule {}
