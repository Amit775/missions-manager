import { Inject, Injectable, Scope } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { BaseRepository } from 'src/database/base.repository';
import { User, UserClaim } from 'src/models/user.model';

@Injectable({ scope: Scope.TRANSIENT })
export class UsersService {
	constructor(@Inject('usersRepository') private repository: BaseRepository<User, string>) { }

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

	public createUser(user: UserClaim): Observable<User> {
		return this.repository.createOne$({ ...user, isAdmin: false, organizationId: new ObjectId() });
	}
}
