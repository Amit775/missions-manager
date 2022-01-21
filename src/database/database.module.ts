import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { BaseRepository } from './base.repository';

export interface DBOptions {
	uri: string;
	name: string;
}

export const CONNECTION_STRING = 'CONNECTION_STRING';
export const DATABASE_NAME = 'DATABASE_NAME';
export const COLLECTION_NAME = 'COLLECTION_NAME';

@Module({})
export class DatabaseModule {
	private static rootOptions: DBOptions;
	static forRoot(options: DBOptions): DynamicModule {
		DatabaseModule.rootOptions = options;
		console.log('for root', options);
		const optionsProviders = DatabaseModule.createProviders(options);
		return {
			module: DatabaseModule,
			providers: optionsProviders,
			exports: [CONNECTION_STRING, DATABASE_NAME]
		};
	}

	static forFeature(name: string, options?: DBOptions): DynamicModule {
		console.log('for feature', name, options);
		const collectionProvider: Provider = {
			provide: Collection,
			useFactory: async (connectionString: string, dbname: string) => {
				console.log('inside factory', name);
				const client = await new MongoClient(options.uri ?? connectionString).connect();
				return client.db(options.name ?? dbname).collection(name);
			},
			inject: [CONNECTION_STRING, DATABASE_NAME]
		};

		return {
			module: DatabaseModule,
			imports: [DatabaseModule.forRoot(DatabaseModule.rootOptions)],
			providers: [
				collectionProvider,
				{ provide: BaseRepository, useClass: BaseRepository },
			],
			exports: [
				Collection,
				BaseRepository
			]
		};
	}

	private static createProviders(options: DBOptions): Provider[] {
		console.log('createProviders', options);
		return [
			{ provide: CONNECTION_STRING, useValue: options.uri },
			{ provide: DATABASE_NAME, useValue: options.name },
		];
	}
}
