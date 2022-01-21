import { Body, Controller, createParamDecorator, ExecutionContext, Get, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User, UserClaim } from 'src/models/user.model';
import { UsersService } from './users.service';

export const UserId = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		const { userId } = request.query;
		return userId;
	}
)

@Controller('users')
export class UsersController {
	constructor(private service: UsersService) { }

	@Post('/')
	public createUser(@Body() user: UserClaim): Observable<User> {
		return this.service.createUser(user);
	}

	@Get('/')
	public getAllUsers(): Observable<User[]> {
		return this.service.getAllUsers();
	}

	@Get('with-ids')
	public getUsersByIds(@Query('ids', new ParseArrayPipe()) usersIds: string[]): Observable<User[]> {
		return this.service.getUsersByIds(usersIds);
	}

	@Get(':id/')
	public getUserById(@UserId() userId: string): Observable<User> {
		return this.service.getUserById(userId);
	}

	@Put(':id/')
	public updateUserHierarchy(@UserId() userId: string, @Query('hierarchy') hierarchy: string): Observable<boolean> {
		return this.service.updateUserHierarchy(userId, hierarchy);
	}
}
