import { Injectable } from "@nestjs/common";
import { Collection, ObjectId } from "mongodb";
import { from, Observable } from "rxjs";
import { Mission } from "../models/missions.model";

@Injectable()
export class MissionsRepository {
    constructor(private collection: Collection<Mission>) { }

    public getAllMissions(): Observable<Mission[]> {
        return from(this.collection.find().toArray());
    }

    public getMissinosById(id: ObjectId): Observable<Mission> {
        return from(this.collection.findOne({ id: id }));
    }

}