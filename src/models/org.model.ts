import { IsMongoId, MinLength } from "class-validator";
import { ObjectId } from "mongodb";

export class Org {
	@IsMongoId()
	_id: ObjectId;

	@MinLength(1)
	name: string;

	@MinLength(1)
	hierarchy: string;
}