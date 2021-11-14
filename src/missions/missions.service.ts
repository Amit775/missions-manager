import { Injectable } from '@nestjs/common';
import { MissionsRepository } from './missions.repository';

@Injectable()
export class MissionsService {
  constructor(private repository: MissionsRepository) {}
}
