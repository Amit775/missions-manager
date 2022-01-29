import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrgsController } from './orgs.controller';
import { OrgsService } from './orgs.service';

@Module({
	imports: [DatabaseModule.forFeature('orgs')],
	controllers: [OrgsController],
	providers: [OrgsService],
	exports: [OrgsService]
})
export class OrgsModule { }
