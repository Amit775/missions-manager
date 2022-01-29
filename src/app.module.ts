import { Module } from '@nestjs/common';
import { GroupsModule } from './groups/groups.module';
import { MissionsModule } from './missions/missions.module';
import { OrgsModule } from './orgs/orgs.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		MissionsModule,
		UsersModule,
		GroupsModule,
		OrgsModule
	]
})
export class AppModule { }
