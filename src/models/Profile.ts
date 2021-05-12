import { Document, Schema } from 'mongoose';
import { Context } from './enumerations/ContextEnum';
import { IGroup } from './Group';
import { IMaintained } from './Maintained';
import { IMaintainer } from './Maintainer';
import { IOrganSystem } from './OrganSystem';
import { IRoute } from './Route';

export interface IProfileDocument extends Document {}
export interface IProfile {
    "status": boolean;
    "name": string;
    "_routeList": IRoute;
    "context": string;
    "scope": IMaintainer & IMaintained & IOrganSystem;
    "group": IGroup;
    "description": string;
}

export const Profile = {
    "status": { type: Boolean, default: false },
    "name": { type: String },
    "_routeList": { type: Schema.Types.ObjectId, ref: "route" },
    "context": { type: String, enum: Object.values(Context) },
    "scope": { type: Schema.Types.ObjectId, refPath: "context" },
    "group": { type: Schema.Types.ObjectId, ref: "group" },
    "description": { type: String }
}