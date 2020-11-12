'use strict'

const statusEnum = require('../enumerations/StatusEnum')();

module.exports = (ObjectId) => {

    return {
        '_acao': { type: ObjectId, ref: 'acao' },
        // ? URL && ARQUIVO
        'titulo': { type: String },
        'tipo': { type: String },
        'observacao': { type: String },
        'status': { 
            type: String, 
            enum: Object.values(statusEnum),
            default: statusEnum.EM_ESTUDO
        },
        'url': { type: String },
        
        // ? ARQUIVO
        'name': { type: String },
        'size': { type: Number },
        'key': { type: String },
        '_metadata': { type: ObjectId, ref: 'metadata' }
    }
}