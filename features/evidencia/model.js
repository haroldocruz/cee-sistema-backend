
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

module.exports = function (itemName, obj) {
    const DB = require('../../db/dbConnect');
    const Schema = DB.Mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;

    var itemObj = (obj) ? obj : require('../' + itemName + '/object')(ObjectId);

    var itemSchema = new Schema(itemObj, { collection: itemName });
    

    itemSchema.pre("remove", function(next){
        console.log("ARQUIVO#############################: ")
        console.log(this.key)
        return promisify(fs.unlink)(
            // path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
            path.resolve(__dirname, 'public', 'archives', this.key)
        );
    });
    itemSchema.pre("save", function(next){
        if(!this.url){
            // this.url = `${process.env.APP_URL}/files/${this.key}`;
            this.url = `http://localhost:3000/archives/${this.key}`;
        }
        next();
    });

    var itemModel = DB.Mongoose.model(itemName, itemSchema, itemName);
    
    return itemModel;
}