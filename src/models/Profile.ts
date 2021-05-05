import { Document, Schema } from 'mongoose';
import { ModelNameEnum } from './enumerations/ModelNameEnum';

export interface IProfile extends Document {
    "status": boolean;
    "name": string;
    "description": string;
    // "roleCrud"?: IRoleCrud[];
}

export const Profile = {
    "status": { type: Boolean, default: false},
    "name": { type: String },
    "description": { type: String }
}