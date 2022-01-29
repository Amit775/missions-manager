import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { BaseRepository } from 'src/database/base.repository';
import { Org } from 'src/models/org.model';

@Injectable()
export class OrgsService {
	constructor(@Inject('orgsRepository') private repository: BaseRepository<Org>) { }

	getAllOrgs(): Observable<Org[]> {
		return this.repository.find$();
	}

	getOrgById(id: ObjectId): Observable<Org> {
		return this.repository.findOne$(id)
	}

	getSubordinateOrgs(org: Org): Observable<Org[]> {
		return this.repository.find$({ hierarchy: `/^${org.hierarchy}` }, { sort: { hierarchy: 1 } });
	}

	getSuperiorOrgs(org: Org): Observable<Org[]> {
		return this.repository.find$({ name: { $in: org.hierarchy.split('/') } });
	}

	createOrg(hierarchy: string): Observable<Org> {
		const org: Org = {
			_id: null,
			name: hierarchy.split('/')[-1],
			hierarchy
		};

		return this.repository.createOne$(org);
	}

	ensueHierarchyExist(hierarchy: string): Observable<Org[]> {
		const orgs = hierarchy.split('/')
			.map((orgName: string, index: number) => ({ name: orgName, hierarchy: hierarchy.split('/', index + 1).join('/') }));

		return this.repository.create$([...orgs.map(({ name, hierarchy }) => ({ _id: null, name, hierarchy }))], { ordered: false });
	}
}
