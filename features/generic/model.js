
module.exports = function (itemName, obj) {
    const DB = require('../../db/dbConnect');
    const Schema = DB.Mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;

    var itemObj = (obj) ? obj : require('../' + itemName + '/object')(ObjectId);

    var itemSchema = new Schema(itemObj, { collection: itemName });
    var itemModel = DB.Mongoose.model(itemName, itemSchema, itemName);
    
    return itemModel;
}