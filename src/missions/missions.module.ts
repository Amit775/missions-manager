import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
	imports: [DatabaseModule.forFeature('missions')],
	controllers: [MissionsController],
	providers: [MissionsService],
})
export class MissionsModule { }
