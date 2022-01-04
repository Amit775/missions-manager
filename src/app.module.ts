import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MissionsModule } from './missions/missions.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [
		DatabaseModule.forRoot({
			uri: 'mongodb+srv://bublil:bublil@missions-manager.akbe9.mongodb.net/missions-manager?authSource=admin&replicaSet=atlas-s1148w-shard-0&w=majority&readPreference=primary&appname=mongodb-vscode%200.7.0&retryWrites=true&ssl=true',
			name: 'missions-manager',
		}),
		MissionsModule,
		// UsersModule,
		// GroupsModule,
	]
})
export class AppModule { }
