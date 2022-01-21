import { IsMongoId, MinLength, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongodb';

import { UserId, UserWithRole } from './user.model';

export class GroupId {
	@IsMongoId()
	_id: ObjectId;
}

export class BaseGroup extends GroupId {
	@MinLength(1)
	name: string;

	@MinLength(1)
	description: string;
}

export class Group extends BaseGroup {
	@MinLength(1)
	creator: UserId['_id'];

	@ValidateNested({ each: true })
	users: UserWithRole[];

	@MinLength(1)
	joinRequests: UserId['_id'][];
}
