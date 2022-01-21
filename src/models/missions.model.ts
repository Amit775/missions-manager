import { IsDate, IsMongoId, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserId, UserWithPermission } from './user.model';

export class BaseMission {
	@MinLength(1)
	name: string;

	@MinLength(1)
	description: string;
}

export class Mission extends BaseMission {
	@IsMongoId()
	_id: ObjectId;

	@ValidateNested({ each: true })
	users: UserWithPermission[];

	@MinLength(1)
	creator: UserId['_id'];
	
	@IsDate()
	createdTime: Date;

	@IsDate()
	updatedTime: Date;

	@MinLength(1, { each: true })
	joinRequests: UserId['_id'][];
}
