import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';

@Module({
    controllers: [MissionsController]
})
export class MissionsModule {}
