import { DynamicModule, Module, Provider, Scope } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { BaseRepository } from './base.repository';

export interface DBOptions {
	uri: string;
	name: string;
}

export const CONNECTION_STRING = 'CONNECTION_STRING';
export const DATABASE_NAME = 'DATABASE_NAME';
export const COLLECTION_NAME = 'COLLECTION_NAME';

const dboptions = {
	uri: 'mongodb+srv://bublil:bublil@missions-manager.akbe9.mongodb.net/missions-manager?authSource=admin&replicaSet=atlas-s1148w-shard-0&w=majority&readPreference=primary&appname=mongodb-vscode%200.7.0&retryWrites=true&ssl=true',
	name: 'missions-manager',
};

function createOptionsProviders(options: DBOptions): Provider[] {
	return [
		{ provide: CONNECTION_STRING, useValue: options.uri },
		{ provide: DATABASE_NAME, useValue: options.name }
	];
}

function createCollectionProvider(name: string): (uri: string, db: string) => Promise<Collection> {
	return async (uri: string, db: string) => {
		const client = await new MongoClient(uri).connect();
		return client.db(db).collection(name);
	}
}

function createFeatureConnectionProviders(name: string): Provider[] {
	console.log(name);
	return [{
		provide: Collection,
		useFactory: createCollectionProvider(name),
		inject: [CONNECTION_STRING, DATABASE_NAME],
		scope: Scope.TRANSIENT
	}];
}

@Module({})
export class DatabaseModule {
	static forFeature(name: string, options: DBOptions = dboptions): DynamicModule {
		const providers: Provider[] = [
			...createOptionsProviders(options),
			...createFeatureConnectionProviders(name),
			{ provide: `${name}Repository`, useClass: BaseRepository }
		];

		return {
			module: DatabaseModule,
			providers,
			exports: [`${name}Repository`]
		};
	}
}
