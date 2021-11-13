import { Injectable } from "@nestjs/common";
import { Collection } from "mongodb";
import { Mission } from "./models/missions.models";

@Injectable()
export class MissionsRepository {
    constructor(private collection: Collection<Mission>) { }
}