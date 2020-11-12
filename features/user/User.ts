import { Document, Schema, Model } from "mongoose";

export interface IUserBase {
    'status': boolean;
    'name': string;
    'profiles': [string]; //encrypted
    'profilesHash': string; //encrypted
    'cpf': string;
    'rg': {
        'number': number;
        'expeditionDate': Date;
        'dispatcherAgency': string;
        'uf': string
    };
    'contact': Schema.Types.ObjectId;
    'maritalStatus': string;
    'gender': string;
    'dataAccess': {
        'username': string;
        'password': string;
        'passwordHash': string; //encrypted
    };
    'birthDate': string;
    'address': Schema.Types.ObjectId;
    'loginInfo': {
        'lastLoginDate': Date;
        'token': string;
        'providerId': string;
        'providerKey': string;
    }
    'metadata': Schema.Types.ObjectId;
    'email': string;
    'phone': [string];
}

export interface IUser extends IUserBase, Document { }
export interface IUser2 extends Model<Document, IUserBase> { }

export const User = {
    'status': { type: Boolean, default: false },
    'contact': [{ type: Schema.Types.ObjectId, ref: 'contact' }],
    'name': { type: String },
    'profiles': [{ type: String }],
    'profilesHash': { type: String }, //encrypted
    'cpf': { type: String },
    'rg': {
        'number': { type: Number},
        'expeditionDate': { type: Date},
        'dispatcherAgency': { type: String},
        'uf': String
    },
    'maritalStatus': String,
    'gender': String,
    'dataAccess': {
        'username': String,
        'password': String, //encrypted
    },
    'birthDate': String,
    'address': Schema.Types.ObjectId,
    'loginInfo': [{
        'lastDate': Date,
        'token': String,
        'providerId': String,
        'providerKey': String,
    }],

    'metadata': { type: Schema.Types.ObjectId, ref: 'metadata' }
}