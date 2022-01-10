import { Body, Controller, createParamDecorator, ExecutionContext, Get, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { BaseMission, Mission } from 'src/models/missions.model';
import { Permission } from 'src/models/permissions.model';
import { UserWithPermission } from 'src/models/user.model';
import { MissionsService } from './missions.service';

const MissionId = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		const { id: missionId } = request.params;

		return new ObjectId(missionId);
	}
)
@Controller('missions')
export class MissionsController {
	constructor(private service: MissionsService) { }

	@Get('/')
	getAllMissions(): Observable<Mission[]> {
		return this.service.getAllMissions();
	}

	@Get('names')
	getAllMissionsNames(): Observable<string[]> {
		return this.service.getAllMissionsNames();
	}

	@Get('with-ids')
	getMissionsByIds(@Query('ids', new ParseArrayPipe()) ids: string[]): Observable<Mission[]> {
		return this.service.getMissionsByIds(ids.map(id => new ObjectId(id)));
	}

	@Get('of-user')
	getAllMissionsOfUser(@Query('userId') userId: string): Observable<Mission[]> {
		return this.service.getAllMissionsOfUser(userId);
	}

	@Post('/')
	createMission(@Body() baseMission: BaseMission): Observable<Mission> {
		return this.service.createMission(baseMission);
	}

	@Get(':id/')
	getMissionById(@MissionId() missionId: ObjectId): Observable<Mission> {
		return this.service.getMissionById(missionId);
	}

	@Get(':id/permission-of-user')
	getPermissionsofUser(@MissionId() missionId: ObjectId, @Query('userId') userId: string): Observable<Permission> {
		return this.service.getPermissionsOfUser(missionId, userId);
	}

	@Put(':id/ask-to-join')
	askToJoinMission(@MissionId() missionId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.addToJoinRequests(missionId, userId);
	}

	@Put(':id/cancel-join-request')
	cancelJoinRequest(@MissionId() missionId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeFromJoinRequests(missionId, userId);
	}

	@Put(':id/leave')
	leaveMission(@MissionId() missionId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromMission(missionId, userId);
	}

	@Put(':id/')
	updateMission(@MissionId() missionId: ObjectId, @Body() baseMission: Partial<BaseMission>): Observable<boolean> {
		return this.service.updateBaseMission(missionId, baseMission);
	}

	@Put(':id/reject-join-request')
	rejectJoinRequest(@MissionId() missionId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeFromJoinRequests(missionId, userId);
	}

	@Put(':id/accept-join-request')
	acceptJoinRequest(@MissionId() missionId: ObjectId, @Body() userWithPermission: UserWithPermission): Observable<boolean> {
		return this.service.acceptJoinRequest(missionId, userWithPermission);
	}

	@Put(':id/remove-user')
	removeUserFromMission(@MissionId() missionId: ObjectId, @Query('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromMission(missionId, userId);
	}

	@Put(':id/add-user')
	addUserToMission(@MissionId() missionId: ObjectId, @Body() userWithPermission: UserWithPermission): Observable<boolean> {
		return this.service.addUserToMission(missionId, userWithPermission);
	}

	@Put(':id/change-user-permission')
	changeUserPermission(@MissionId() missionId: ObjectId, @Body() userWithPermission: UserWithPermission): Observable<boolean> {
		return this.service.updateUserPermission(missionId, userWithPermission);
	}
}
