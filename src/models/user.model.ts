import { ObjectId } from "mongodb";
import { Permission, Role } from "./permissions.model";

export interface UserId {
	_id: string;
}

export interface UserClaim extends UserId {
	name: string;
	hierarchy: string;
}

export interface User extends UserClaim {
	isAdmin: boolean;
	organizationId: ObjectId;
}

export type UserWithPermission = UserId & { permission: Permission };
export type UserWithRole = UserId & { role: Role };