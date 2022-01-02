import { Controller, Get, Param, ParseArrayPipe, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private service: UsersService) { }

	@Get('getUserById')
	public getUserById(@Param('userId') userId: string): Observable<User> {
		return this.service.getUserById(userId);
	}

	@Get('getUsersByIds')
	public getUsersByIds(@Param('usersIds', new ParseArrayPipe()) usersIds: string[]): Observable<User[]> {
		return this.service.getUsersByIds(usersIds);
	}

	@Get('getAllUsers')
	public getAllUsers(): Observable<User[]> {
		return this.service.getAllUsers();
	}

	@Put('updateUserHierarchy')
	public updateUserHierarchy(@Param('userId') userId: string, @Param('hierarchy') hierarchy: string): Observable<boolean> {
		return this.service.updateUserHierarchy(userId, hierarchy);
	}

	@Post('createUser')
	public createUser(user: User): Observable<User> {
		return this.service.createUser(user);
	}
}
