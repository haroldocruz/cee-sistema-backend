'use strict'

const statusEnum = require('../enumerations/StatusEnum')();

module.exports = (ObjectId) => {

    return {
        'titulo': { type: String },
        'tipo': { type: String },
        'observacao': { type: String },
        'status': { 
            type: String, 
            enum: Object.values(statusEnum),
            default: statusEnum.EM_ESTUDO
        },

        'name': { type: String },
        'size': { type: Number },
        'key': { type: String },
        'url': { type: String },
        '_metadata': { type: ObjectId, ref: 'metadata' }
    }
}