import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { BaseRepository } from 'src/database/base.repository';
import { BaseGroup, Group } from 'src/models/group.model';
import { UserWithRole } from 'src/models/user.model';

@Injectable()
export class GroupsService {
	constructor(private repository: BaseRepository<Group>) { }

	public getAllGroups(): Observable<Group[]> {
		return this.repository.find$();
	}

	public getGroupOfUser(userId: string): Observable<Group[]> {
		return this.repository.find$({ users: { $all: [{ $elemMatch: userId }] } });
	}

	public getGroupById(groupId: ObjectId): Observable<Group> {
		return this.repository.findOne$(groupId);
	}

	public createGroup(group: BaseGroup): Observable<Group> {
		return this.repository.createOne$(group as Group);
	}

	public updateGroup(groupId: ObjectId, baseGroup: BaseGroup): Observable<boolean> {
		return this.repository.updateOne$(groupId, baseGroup);
	}

	public addUserToGroup(groupId: ObjectId, user: UserWithRole): Observable<boolean> {
		return this.repository.updateOne$(groupId, { $push: { users: user } });
	}

	public removeUserFromGroup(groupId: ObjectId, userId: string): Observable<boolean> {
		return this.repository.updateOne$(groupId, { $pull: { users: { _id: userId } } });
	}

	public acceptJoinRequest(groupId: ObjectId, user: UserWithRole): Observable<boolean> {
		return this.repository.updateOne$(groupId, { $push: { users: user }, $pull: { joinRequests: user._id } });
	}

	public addUserToJoinRequest(groupId: ObjectId, userId: string): Observable<boolean> {
		return this.repository.updateOne$(groupId, { $push: { joinRequests: userId } });
	}

	public removeUserFromJoinRequest(groupId: ObjectId, userId: string): Observable<boolean> {
		return this.repository.updateOne$(groupId, { $pull: { joinRequests: userId } });
	}
}
