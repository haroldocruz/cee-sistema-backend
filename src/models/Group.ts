import { IRoute } from './Route';
import { Document, Schema } from 'mongoose';

export interface IGroup extends IGroupBase, Document {}
export interface IGroupBase {
    "status": boolean;
    "name": string;
    "context"?: string;
    "description"?: string;
    "routes"?: IRoute[];
}

export const Group = {
    "status": { type: Boolean, default: false},
    "name": { type: String },
    "context": { type: String },
    "description": { type: String },
    "routes": [{ type: Schema.Types.ObjectId, ref: 'route' }]
    // "routes": [{ "urn": String, "description": String }]
}