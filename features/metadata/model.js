
module.exports = function (itemName) {
    const DB = require('../../db/dbConnect');
    const Schema = DB.Mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;

    var itemObj = require('./object')(ObjectId);

    var itemSchema = new Schema(itemObj, { collection: itemName });
    var itemModel = DB.Mongoose.model(itemName, itemSchema, itemName);
    
    return itemModel;
}