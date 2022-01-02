import { Body, Controller, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable, switchMap } from 'rxjs';
import { BaseMission, Mission } from 'src/models/missions.model';
import { Permission } from 'src/models/permissions.model';
import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
	constructor(private service: MissionsService) { }

	@Get('GelAllMissions')
	getAllMissions(): Observable<Mission[]> {
		return this.service.getAllMissions();
	}

	@Get('getAllMissionsNames')
	getAllMissionsNames(): Observable<string[]> {
		return this.service.getAllMissionsNames();
	}

	@Get('GetMissionById/:id')
	getMissionById(@Param('id') id: string): Observable<Mission> {
		return this.service.getMissionById(new ObjectId(id));
	}

	@Get('getMissionsByIds')
	getMissionsByIds(@Query('ids', new ParseArrayPipe()) ids: string[]): Observable<Mission[]> {
		return this.service.getMissionsByIds(ids.map(id => new ObjectId(id)));
	}

	@Get('getPermissionsOfUser')
	getPermissionsofUser(@Query('missionId') missionId: string, @Query('userId') userId: string): Observable<Permission> {
		return this.service.getPermissionsOfUser(new ObjectId(missionId), userId);
	}

	@Get('getAllMissionsOfUser')
	getAllMissionsOfUser(@Query('userId') userId: string): Observable<Mission[]> {
		return this.service.getAllMissionsOfUser(userId);
	}

	@Post('createMission')
	createMission(@Body() baseMission: BaseMission): Observable<Mission> {
		return this.service.createMission(baseMission as Mission);
	}

	@Put('askToJoinMission')
	askToJoinMission(@Query('missionId') missionId: string, @Query('userId') userId: string): Observable<boolean> {
		return this.service.addToJoinRequests(new ObjectId(missionId), userId);
	}

	@Put('cancelJoinRequest')
	cancelJoinRequest(@Query('missionId') missionId: string, @Query() userId: string): Observable<boolean> {
		return this.service.removeFromJoinRequests(new ObjectId(missionId), userId);
	}

	@Put('leaveMission')
	leaveMission(@Query('missionId') missionId: string, @Query() userId: string): Observable<boolean> {
		return this.service.removeUserFromMission(new ObjectId(missionId), userId);
	}

	@Put('updateMission')
	updateMission(@Param('missionId') missionId: string, baseMission: BaseMission): Observable<boolean> {
		return this.service.updateBaseMission(new ObjectId(missionId), baseMission);
	}

	@Put('rejecetJoinRequest')
	rejectJoinRequest(@Param('missionId') missionId: string, @Param('userId') userId): Observable<boolean> {
		return this.service.removeFromJoinRequests(new ObjectId(missionId), userId);
	}

	@Put('acceptJoinRequest')
	acceptJoinRequest(@Param('missionId') missionId: string, @Param('userId') userId, @Param('permission') permission: Permission = Permission.READ): Observable<boolean> {
		return this.service.removeFromJoinRequests(new ObjectId(missionId), userId).pipe(
			switchMap(() => this.service.addUserToMission(new ObjectId(missionId), userId, permission))
		);
	}

	@Put('removeUserFromMission')
	removeUserFromMission(@Param('missionId') missionId: string, @Param('userId') userId: string): Observable<boolean> {
		return this.service.removeUserFromMission(new ObjectId(missionId), userId);
	}

	@Put('addUserToMission')
	addUserToMission(@Param('missionId') missionId: string, @Param('userId') userId: string, @Param('permission') permission: Permission): Observable<boolean> {
		return this.service.addUserToMission(new ObjectId(missionId), userId, permission);
	}

	@Put('changeUserPermission')
	changeUserPermission(@Param('missionId') missionId: string, @Param('userId') userId: string, @Param('permission') permission: Permission): Observable<boolean> {
		return this.service.changeUserPermission(new ObjectId(missionId), userId, permission);
	}
}
