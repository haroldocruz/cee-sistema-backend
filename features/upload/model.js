
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

module.exports = function (itemName) {
    const DB = require('../../db/dbConnect');
    const Schema = DB.Mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;

    var itemObj = require('./object')(ObjectId);

    var itemSchema = new Schema(itemObj, { collection: itemName });

    itemSchema.pre("save", function(next){
        if(!this.url){
            // this.url = `${process.env.APP_URL}/files/${this.key}`;
            this.url = `http://localhost:3000/archives/${this.key}`;
        }
        next();
    });

    itemSchema.pre("remove", function(){
        return promisify(fs.unlink)(
            // path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
            `public/archives/${this.key}`
        );
    });

    var itemModel = DB.Mongoose.model(itemName, itemSchema, itemName);
    
    return itemModel;
}