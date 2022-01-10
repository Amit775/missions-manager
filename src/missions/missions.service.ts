import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { map, Observable, switchMap } from 'rxjs';
import { NotFoundError } from 'src/models/errors/error.model';
import { BaseMission, Mission } from 'src/models/missions.model';
import { Permission } from 'src/models/permissions.model';
import { UserWithPermission } from 'src/models/user.model';
import { BaseRepository } from '../database/base.repository';

@Injectable()
export class MissionsService {
	constructor(private repository: BaseRepository<Mission>) { }

	public getAllMissions(): Observable<Mission[]> {
		return this.repository.find$();
	}

	public getMissionById(id: ObjectId): Observable<Mission> {
		return this.repository.findOne$(id);
	}

	public getMissionsByIds(ids: ObjectId[]): Observable<Mission[]> {
		return this.repository.find$({ _id: { $in: ids } });
	}

	public getAllMissionsNames(): Observable<string[]> {
		return this.repository
			.find$()
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
					(mission) => {
						if (!mission) throw new NotFoundError(`mission with id ${missionId}`);

						const userInMission = mission.users.find((user) => user._id === userId);
						if (!userInMission) return Permission.NONE;

						return userInMission.permission
					}
				),
			);
	}

	public getAllMissionsOfUser(userId: string): Observable<Mission[]> {
		return this.repository.find$({
			users: { $all: [{ $elemMatch: { _id: userId } }] },
		});
	}

	public createMission(baseMission: BaseMission): Observable<Mission> {
		const mission: Mission = {
			...baseMission,
			_id: null,
			users: [],
			joinRequests: [],
			createdTime: new Date(),
			updatedTime: new Date(),
			creator: 'creator'
		}
		return this.repository.createOne$(mission);
	}

	public updateBaseMission(missionId: ObjectId, baseMission: Partial<BaseMission>): Observable<boolean> {
		Object.keys(baseMission).forEach(
			(key: string) => baseMission[key] === undefined && delete baseMission[key],
		);
		return this.repository.updateOne$(missionId, { $set: baseMission });
	}

	public addToJoinRequests(missionId: ObjectId, userId: string): Observable<boolean> {
		return this.repository.updateOne$(missionId, { $addToSet: { joinRequests: userId } });
	}

	public removeFromJoinRequests(missionId: ObjectId, userId: string): Observable<boolean> {
		return this.repository.updateOne$(missionId, { $pull: { joinRequests: userId } });
	}

	public acceptJoinRequest(missionId: ObjectId, user: UserWithPermission): Observable<boolean> {
		return this.repository.updateOne$(missionId, { $pull: { joinRequests: user._id }, $addToSet: { users: user } });
	}

	public addUserToMission(missionId: ObjectId, user: UserWithPermission,): Observable<boolean> {
		return this.repository.update$({ _id: missionId, users: { $not: { $elemMatch: { _id: user._id } } } }, { $addToSet: { users: user }, });
	}

	public removeUserFromMission(missionId: ObjectId, userId: string): Observable<boolean> {
		return this.repository.updateOne$(missionId, { $pull: { users: { _id: userId } } });
	}

	public updateUserPermission(missionId: ObjectId, user: UserWithPermission): Observable<boolean> {
		return this.repository.updateOne$(missionId, { $pull: { users: { _id: user._id } }, $addToSet: { users: user } });
	}
}
