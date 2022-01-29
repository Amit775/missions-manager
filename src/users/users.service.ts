import { Inject, Injectable, Scope } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { map, Observable, switchMap } from 'rxjs';
import { BaseRepository } from 'src/database/base.repository';
import { Org } from 'src/models/org.model';
import { User, UserClaim } from 'src/models/user.model';
import { OrgsService } from 'src/orgs/orgs.service';

@Injectable({ scope: Scope.TRANSIENT })
export class UsersService {
	constructor(
		@Inject('usersRepository') private repository: BaseRepository<User, string>,
		private orgsService: OrgsService
	) { }

	public getAllUsers(): Observable<User[]> {
		return this.repository.find$();
	}

	public getUsers(skip: number, limit: number): Observable<User[]> {
		return this.repository.find$({}, { skip, limit });
	}

	public findUsersByName(query: RegExp): Observable<User[]> {
		return this.repository.find$({ name: { $regex: query } });
	}

	public getUserById(userId: string): Observable<User> {
		return this.repository.findOne$(userId);
	}

	public getUsersByIds(usersIds: string[]): Observable<User[]> {
		return this.repository.find$({ _id: { $in: usersIds } })
	}

	public setOrganization(userId: string, organizationId: ObjectId): Observable<boolean> {
		return this.repository.updateOne$(userId, { $set: { organizationId } });
	}

	public updateUserHierarchy(userId: string, hierarchy: string): Observable<boolean> {
		return this.repository.updateOne$(userId, { $set: { hierarchy } });
	}

	public createUser(userClaim: UserClaim): Observable<User> {
		const user: User = { ...userClaim, isAdmin: false, organizationId: null };
		return this.orgsService.ensueHierarchyExist(userClaim.hierarchy).pipe(
			switchMap((orgs: Org[]) => {
				user.organizationId = orgs[orgs.length - 1]._id;
				return this.repository.updateOne$(userClaim._id, { $set: user }, { upsert: true })
			}),
			map(() => user)
		);
	}
}
