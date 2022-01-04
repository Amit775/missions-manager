import { Body, Controller, createParamDecorator, ExecutionContext, Get, Post, Put, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { BaseGroup, Group } from 'src/models/group.model';
import { Role } from 'src/models/permissions.model';
import { GroupsService } from './groups.service';


export const GroupId = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	const { Id: groupId } = request.params;
	return new ObjectId(groupId);
})


@Controller('groups')
export class GroupsController {
	constructor(private service: GroupsService) { }

	@Get('/')
	public getAllGroups(): Observable<Group[]> {
		return this.service.getAllGroups();
	}

	@Post('/')
	public createGroup(@Body() baseGroup: BaseGroup): Observable<Group> {
		return this.service.createGroup(baseGroup)
	}

	@Get('of-user')
	public getGroupsOfUser(@Query('userId') userId: string): Observable<Group[]> {
		return this.service.getGroupOfUser(userId);
	}

	@Get(':id/')
	public getGroupById(@GroupId() groupId: ObjectId): Observable<Group> {
		return this.service.getGroupById(new ObjectId(groupId));
	}

	@Put(':id/ask-to-join')
	public askToJoin(@GroupId() groupId: ObjectId, userId: string): Observable<boolean> {
		return this.service.addUserToJoinRequest(new ObjectId(groupId), userId);
	}

	@Put(':id/cancel-join-request')
	public cancelJoinRequest(@GroupId() groupId: ObjectId, userId: string): Observable<boolean> {
		return this.service.removeUserFromJoinRequest(new ObjectId(groupId), userId);
	}

	@Put(':id/leave')
	public leaveGroup(@GroupId() groupId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromGroup(groupId, userId);
	}

	@Put(':id/')
	public updateGroup(@GroupId() groupId: ObjectId, @Body() baseGroup: BaseGroup) {
		return this.service.updateGroup(groupId, baseGroup);
	}

	@Put(':id/add-user')
	public addUser(@GroupId() groupId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.addUserToGroup(groupId, { _id: userId, role: Role.MEMBER });
	}
	@Put(':id/remove-user')
	public removeUser(@GroupId() groupId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromGroup(groupId, userId);
	}

	@Put(':id/accept-join-request')
	public acceptJoinRequest(@GroupId() groupId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.acceptJoinRequest(groupId, { _id: userId, role: Role.MEMBER });
	}

	@Put(':id/reject-join-request')
	public rejectJoinRequest(@GroupId() groupId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromJoinRequest(groupId, userId);
	}
}
