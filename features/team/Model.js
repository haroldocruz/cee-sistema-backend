'use strict'

const itemName = 'team';

const DB = require('../../db/dbConnect');
const Schema = DB.Mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var itemObj = require('./Object')(ObjectId);

var itemSchema = new DB.Mongoose.Schema(itemObj, { collection: itemName });
var itemModel = DB.Mongoose.model( itemName, itemSchema);

module.exports = {
    Obj: itemObj,
    Schema: itemSchema,
    Model: itemModel
}