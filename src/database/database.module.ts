import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';

export interface DBOptions {
  uri: string;
  name: string;
}

export const CONNECTION_STRING = 'CONNECTION_STRING';
export const DATABASE_NAME = 'DATABASE_NAME';
export const COLLECTION_NAME = 'COLLECTION_NAME';

@Module({
  providers: [Collection],
})
export class DatabaseModule {
  static forRoot(options: DBOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: DatabaseModule.createProviders(options),
    };
  }

  static forFeature(name: string, options?: DBOptions): DynamicModule {
    const collectionProvider: Provider = {
      provide: Collection,
      useFactory: (CONNECTION_STRING: string, DATABASE_NAME: string) => {
        return new MongoClient(options.uri ?? CONNECTION_STRING)
          .db(options.name ?? DATABASE_NAME)
          .collection(name);
      },
      inject: [CONNECTION_STRING, DATABASE_NAME],
    };
    return {
      module: DatabaseModule,
      providers: [collectionProvider],
    };
  }

  private static createProviders(options: DBOptions): Provider[] {
    return [
      { provide: CONNECTION_STRING, useValue: options.uri },
      { provide: DATABASE_NAME, useValue: options.name },
    ];
  }
}
