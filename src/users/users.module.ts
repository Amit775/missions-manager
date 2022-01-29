import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrgsModule } from 'src/orgs/orgs.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		DatabaseModule.forFeature('users'),
		OrgsModule
	],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule { }
