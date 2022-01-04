import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
	imports: [forwardRef(() => DatabaseModule.forFeature('missions', {
		name: 'missions-manager',
		uri: 'mongodb+srv://bublil:bublil@missions-manager.akbe9.mongodb.net/missions-manager?authSource=admin&replicaSet=atlas-s1148w-shard-0&w=majority&readPreference=primary&appname=mongodb-vscode%200.7.0&retryWrites=true&ssl=true'
	}))],
	controllers: [MissionsController],
	providers: [MissionsService],
})
export class MissionsModule { }
