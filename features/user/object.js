'use strict'

module.exports = (ObjectId) => {
    // const Phone = require('../../objects/phone');
    const address = require('../../objects/address');
    const loginInfo = require('../../objects/loginInfo');

    return {
        // '_accessLevel': { type: ObjectId, ref: 'accessLevel' },
        'accessLevel': { type: String },
        // '_userSettings': { type: ObjectId, ref: 'userSettings' },
        'name': { type: String },
        'cpf': { type: String, unique: true, required: true, trim: true },
        'email': { type: String, unique: true, required: true, lowercase: true, trim: true },
        'password': { type: String, select: false },
        'phone': { type: String, trim: true },
        'address': address,
        'loginInfo': loginInfo,
        'status': { type: String },
        '_metadata': { type: ObjectId, ref: 'metadata' },
    }
}

