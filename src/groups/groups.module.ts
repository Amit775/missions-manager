import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
	imports: [DatabaseModule.forFeature('groups')],
	controllers: [GroupsController],
	providers: [GroupsService],
})
export class GroupsModule { }
