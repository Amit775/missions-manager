import { ObjectId } from 'mongodb';
import { UserWithPermission } from './user.model';

export interface BaseMission {
  name: string;
  description: string;
}

export interface Mission extends BaseMission {
  _id: ObjectId;
  users: UserWithPermission[];
  creator: string;
  createdTime: Date;
  updatedTime: Date;
  joinRequests: string[];
}
