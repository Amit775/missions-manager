import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { map, Observable, switchMap } from 'rxjs';
import { BaseMission, Mission } from 'src/models/missions.model';
import { Permission } from 'src/models/permissions.model';
import { BaseRepository } from '../database/base.repository';

@Injectable()
export class MissionsService {
	constructor(private repository: BaseRepository<Mission>) { }

	public getAllMissions(): Observable<Mission[]> {
		return this.repository.findMany$();
	}

	public getMissionById(id: ObjectId): Observable<Mission> {
		return this.repository.findOne$(id);
	}

	public getMissionsByIds(ids: ObjectId[]): Observable<Mission[]> {
		return this.repository.findMany$({ _id: { $in: ids } });
	}

	public getAllMissionsNames(): Observable<string[]> {
		return this.repository
			.findMany$()
			.pipe(map((missions) => missions.map((mission) => mission.name)));
	}

	public getPermissionsOfUser(
		missionId: ObjectId,
		userId: string,
	): Observable<Permission> {
		return this.repository
			.findOne$(missionId)
			.pipe(
				map(
					(mission) =>
						mission.users.find((user) => user._id === userId).permission,
				),
			);
	}

	public getAllMissionsOfUser(userId: string): Observable<Mission[]> {
		return this.repository.findMany$({
			users: { $all: [{ $elemMatch: { _id: userId } }] },
		});
	}

	public createMission(mission: Mission): Observable<Mission> {
		return this.repository.createOne$(mission);
	}

	public updateBaseMission(
		missionId: ObjectId,
		baseMission: BaseMission,
	): Observable<boolean> {
		Object.keys(baseMission).forEach(
			(key: string) =>
				baseMission[key] === undefined && delete baseMission[key],
		);
		return this.repository.updateOne$(missionId, { $set: baseMission });
	}

	public addToJoinRequests(
		missionId: ObjectId,
		userId: string,
	): Observable<boolean> {
		return this.repository.updateOne$(missionId, {
			$addToSet: { joinRequests: userId },
		});
	}

	public removeFromJoinRequests(
		missionId: ObjectId,
		userId: string,
	): Observable<boolean> {
		return this.repository.updateOne$(missionId, {
			$pull: { joinRequests: userId },
		});
	}

	public addUserToMission(
		missionId: ObjectId,
		userId: string,
		permission: Permission,
	): Observable<boolean> {
		return this.repository.updateOne$(missionId, {
			$addToSet: { users: { _id: userId, permission } },
		});
	}

	public removeUserFromMission(
		missionId: ObjectId,
		userId: string,
	): Observable<boolean> {
		return this.repository.updateOne$(missionId, {
			$pull: { users: { _id: userId } },
		});
	}

	public changeUserPermission(missionId: ObjectId, userId: string, permission: Permission): Observable<boolean> {
		return this.repository.updateOne$(missionId, { $pull: { users: { _id: userId } } }).pipe(
			switchMap(() => this.repository.updateOne$(missionId, { $push: { users: { _id: userId, permission } } }))
		);
	}
}
