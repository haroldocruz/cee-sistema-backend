import { Document } from 'mongoose';

export interface IRoute extends IRouteBase, Document {}
export interface IRouteBase {
    "status"?: boolean;
    "urn": string;
    "description"?: string;
}

export const Route = {
    "status": { type: Boolean, default: false},
    "urn": { type: String },
    "description": { type: String }
}