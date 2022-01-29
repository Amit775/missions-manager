import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Org } from 'src/models/org.model';
import { OrgsService } from './orgs.service';

@Controller('orgs')
export class OrgsController {
	constructor(private service: OrgsService) { }

	@Get('/')
	getAllOrgs(): Observable<Org[]> {
		return this.service.getAllOrgs();
	}

	@Post('/')
	createOrg(@Body('hierarchy') hierarchy: string): Observable<Org> {
		return this.service.createOrg(hierarchy);
	}

	@Get('/sub-orgs')
	getSubordinateOrgs(@Body() org: Org): Observable<Org[]> {
		return this.service.getSubordinateOrgs(org);
	}

	@Get('/super-orgs')
	getSuperiorOrgs(@Body() org: Org): Observable<Org[]> {
		return this.service.getSuperiorOrgs(org)
	}
}
