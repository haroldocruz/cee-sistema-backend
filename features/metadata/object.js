'use strict'

module.exports = (ObjectId) => {

    return {
        '_model': { type: ObjectId, refPath: '_modelName' },
        '_modelName': { type: String },
        
        '_createdBy': { type: ObjectId, ref: 'user' },
        '_createdAt': { type: Date, default: Date.now },
        '_modifiedBy': { type: ObjectId, ref: 'user' },
        '_lastModifiedAt': { type: Date, default: Date.now },
        '_owner': { type: ObjectId, ref: 'user' }
    }
}

