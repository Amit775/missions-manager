import { IsMongoId, MinLength, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongodb';

import { UserId, UserWithRole } from './user.model';

export class BaseGroup  {
	@MinLength(1)
	name: string;

	@MinLength(1)
	description: string;
}

export class Group extends BaseGroup {
	@IsMongoId()
	_id: ObjectId;

	@MinLength(1)
	creator: UserId['_id'];

	@ValidateNested({ each: true })
	users: UserWithRole[];

	@MinLength(1)
	joinRequests: UserId['_id'][];
}
