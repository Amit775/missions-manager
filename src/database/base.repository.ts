import { Injectable } from '@nestjs/common';
import {
	BulkWriteOptions,
	Collection,
	DeleteOptions,
	Filter,
	FindOptions,
	ObjectId,
	OptionalId,
	UpdateFilter,
	UpdateOptions
} from 'mongodb';
import { from, map, Observable } from 'rxjs';

export interface IReader<T, ID = ObjectId> {
	findOne$(_id: ID, options?: FindOptions): Observable<T>;
	find$(filter?: Filter<T>, options?: FindOptions): Observable<T[]>;
}

export interface IWriter<T, ID = ObjectId> {
	createOne$(item: T, options?: BulkWriteOptions): Observable<T>;
	create$(items: T[], options?: BulkWriteOptions): Observable<T[]>;
	updateOne$(_id: ID, update: UpdateFilter<T>, options?: UpdateOptions,): Observable<boolean>;
	update$(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions,): Observable<boolean>;
	deleteOne$(_id: ID, options?: DeleteOptions): Observable<boolean>;
	delete$(filter: Filter<T>, options?: DeleteOptions): Observable<boolean>;
}

@Injectable()
export class BaseRepository<T, ID = ObjectId> implements IReader<T, ID>, IWriter<T, ID> {
	constructor(private collection: Collection<T>) { }
	findOne$(_id: ID, options?: FindOptions): Observable<T> {
		return from(this.collection.findOne({ _id }, options));
	}

	find$(filter?: Filter<T>, options?: FindOptions): Observable<T[]> {
		return from(this.collection.find(filter, options).toArray());
	}

	createOne$(item: T, options?: BulkWriteOptions): Observable<T> {
		return from(this.collection.insertOne(item as OptionalId<T>, options)).pipe(
			map((result) => ({ ...item, _id: result.insertedId })),
		);
	}
	create$(items: T[], options?: BulkWriteOptions): Observable<T[]> {
		return from(this.collection.insertMany(items as OptionalId<T>[], options)).pipe(
			map((result) => [
				...items.map((item, index) => ({
					...item,
					_id: result.insertedIds[index],
				})),
			]),
		);
	}
	updateOne$(_id: ID, update: UpdateFilter<T>, options?: UpdateOptions,): Observable<boolean> {
		return from(this.collection.updateOne({ _id }, update, options)).pipe(
			map((result) => result.acknowledged),
		);
	}
	update$(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Observable<boolean> {
		return from(this.collection.updateMany(filter, update, options)).pipe(
			map((result) => result.acknowledged),
		);
	}
	deleteOne$(_id: ID, options?: DeleteOptions): Observable<boolean> {
		return from(this.collection.deleteOne({ _id }, options)).pipe(
			map((result) => result.acknowledged),
		);
	}
	delete$(filter: Filter<T>, options?: DeleteOptions): Observable<boolean> {
		return from(this.collection.deleteMany(filter, options)).pipe(
			map((result) => result.acknowledged),
		);
	}
}
