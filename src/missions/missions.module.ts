import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
    controllers: [MissionsController],
    providers: [MissionsService]
})
export class MissionsModule {}
