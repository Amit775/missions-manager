import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [DatabaseModule.forFeature('users')],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule { }
