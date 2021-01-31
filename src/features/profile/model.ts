// import { IInstrument, obj } from "./IInstrument";

// export default function (itemName: string): IInstrument {
//     const DB = require('../../db/dbConnect');
//     const Schema = DB.Mongoose.Schema;
//     const ObjectId = Schema.Types.ObjectId;

//     // var itemObj = require('../' + itemName + '/object')(ObjectId);
//     var itemObj = obj;

//     var itemSchema = new Schema(itemObj, { collection: itemName });
//     var itemModel = DB.Mongoose.model(itemName, itemSchema, itemName);
    
//     return itemModel;
// }


import { IInstrument, Instrument } from "./../instrument/IInstrument";
import DB from "../../db/dbConnect";
import { Model } from "mongoose";

// export default function (itemName: string): Model<Document, {}> {
export default function (itemName: string): Model<IInstrument> {
    const itemSchema = new DB.Schema(Instrument, { collection: itemName });
    return DB.model<IInstrument>(itemName, itemSchema, itemName);
}