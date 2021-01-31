// import { Model, Document } from "mongoose";
// import DB from "../../db/dbConnect";
// import { User, IUser } from './../../models/User';
// import Auth from "../../authServices";

// export default function (itemName: string) {
//     const itemSchema = new DB.Schema(User, { collection: itemName });

//     itemSchema.pre('save', async function () {
//         const User = <IUser> this;
//         if (User.dataAccess?.password) {
//             User.dataAccess.passwordHash = await Auth.encodePassword(User.dataAccess.password);
//             // delete User.dataAccess.password;
//         }
//         if (User.profiles) {
//             User.profilesHash = await Auth.generateToken(User.profiles);
//             // delete User.profiles;
//         }
//     })

//     return DB.model<IUser>(itemName, itemSchema, itemName);
// }

import { Model } from "mongoose";
import DB from "../../db/dbConnect";
import { IUser, User } from "./../../models/User";

export default function (itemName: string): Model<IUser> {
    const itemSchema = new DB.Schema(User, { collection: itemName });
    return DB.model<IUser>(itemName, itemSchema, itemName);
}