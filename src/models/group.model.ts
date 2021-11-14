import { ObjectId } from 'mongodb';

import { UserWithRole } from './user.model';

export interface GroupId {
  _id: ObjectId;
}

export interface BaseGroup extends GroupId {
  name: string;
  description: string;
}

export interface Group extends BaseGroup {
  creator: string;
  users: UserWithRole[];
  joinRequests: string[];
}
