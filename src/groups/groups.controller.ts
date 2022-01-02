import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { group } from 'console';
import { ObjectId } from 'mongodb';
import { Observable, switchMap } from 'rxjs';
import { BaseGroup, Group } from 'src/models/group.model';
import { Role } from 'src/models/permissions.model';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
	constructor(private service: GroupsService) { }

	@Get('getAllGroups')
	public getAllGroups(): Observable<Group[]> {
		return this.service.getAllGroups();
	}

	@Get('getGroupsOfUser')
	public getGroupsOfUser(@Param('userId') userId: string): Observable<Group[]> {
		return this.service.getGroupOfUser(userId);
	}

	@Get('getGroupsById')
	public getGroupsById(@Param('groupId') groupId: string): Observable<Group> {
		return this.service.getGroupById(new ObjectId(groupId));
	}

	@Post('createGroup')
	public createGroup(@Body() baseGroup: BaseGroup): Observable<Group> {
		return this.service.createGroup(baseGroup)
	}

	@Put('askToJoin')
	public askToJoin(@Param('groupId') groupId: string, userId: string): Observable<boolean> {
		return this.service.addUserToJoinRequest(new ObjectId(groupId), userId);
	}

	@Put('cancelJoinRequest')
	public cancelJoinRequest(@Param('groupId') groupId: string, userId: string): Observable<boolean> {
		return this.service.removeUserFromJoinRequest(new ObjectId(groupId), userId);
	}

	@Put('leaveGroup')
	public leaveGroup(@Param('groupId') groupId: string, @Param('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromGroup(new ObjectId(groupId), userId);
	}

	@Put('updateGroup')
	public updateGroup(@Param('groupId') groupId: string, @Body() baseGroup: BaseGroup) {
		return this.service.updateGroup(new ObjectId(groupId), baseGroup);
	}

	@Put('addUser')
	public addUser(@Param('groupId') groupId: string, @Param('userId') userId: string): Observable<boolean> {
		return this.service.addUserToGroup(new ObjectId(groupId), { _id: userId, role: Role.MEMBER });
	}
	@Put('removeUser')
	public removeUser(@Param('groupId') groupId: string, @Param('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromGroup(new ObjectId(groupId), userId);
	}

	@Put('acceptJoinRequest')
	public acceptJoinRequest(@Param('groupId') groupId: string, @Param('userId') userId: string): Observable<boolean> {
		return this.service.addUserToGroup(new ObjectId(groupId), { _id: userId, role: Role.MEMBER }).pipe(
			switchMap(() => this.service.removeUserFromJoinRequest(new ObjectId(groupId), userId))
		);
	}

	@Put('rejectJoinRequest')
	public rejectJoinRequest(@Param('groupId') groupId: string, @Param('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromJoinRequest(new ObjectId(groupId), userId);
	}
}
