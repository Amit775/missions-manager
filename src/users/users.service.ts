import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { BaseRepository } from 'src/database/base.repository';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersService {
	constructor(private repository: BaseRepository<User, string>) { }

	public getAllUsers(): Observable<User[]> {
		return this.repository.findMany$();
	}

	public getUsers(skip: number, limit: number): Observable<User[]> {
		return this.repository.findMany$({}, { skip, limit });
	}

	public findUsersByName(query: RegExp): Observable<User[]> {
		return this.repository.findMany$({ name: { $regex: query } });
	}

	public getUserById(userId: string): Observable<User> {
		return this.repository.findOne$(userId);
	}

	public getUsersByIds(usersIds: string[]): Observable<User[]> {
		return this.repository.findMany$({ _id: { $in: usersIds } })
	}

	public setOrganization(userId: string, organizationId: ObjectId): Observable<boolean> {
		return this.repository.updateOne$(userId, { $set: { organizationId } });
	}

	public updateUserHierarchy(userId: string, hierarchy: string): Observable<boolean> {
		return this.repository.updateOne$(userId, { $set: { hierarchy } });
	}

	public createUser(user: User): Observable<User> {
		return this.repository.createOne$(user);
	}

}
