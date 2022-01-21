import { IsBoolean, IsEnum, IsMongoId, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';
import { PERMISSION, ROLE } from './permissions.model';

export class UserId {
	@MinLength(1)
	_id: string;
}

export class UserClaim extends UserId {
	@MinLength(1)
	name: string;
	
	@MinLength(1)
	hierarchy: string;
}

export class User extends UserClaim {
	@IsBoolean()
	isAdmin: boolean;
	
	@IsMongoId()
	organizationId: ObjectId;
}

export class UserWithPermission extends UserId {
	@IsEnum(PERMISSION)
	permission: PERMISSION;
}

export class UserWithRole extends UserId { 
	@IsEnum(PERMISSION)
	role: ROLE;
}
