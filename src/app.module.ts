import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MissionsModule } from './missions/missions.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [
		MissionsModule,
		UsersModule,
		// GroupsModule,
	]
})
export class AppModule { }
