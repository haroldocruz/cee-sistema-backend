'use strict'

// const mongoose = require('mongoose');

// const conn = {
//     protocol: 'mongodb://',
//     user: '', // admin
//     password: '', // GE0xJoamuF4y
//     address: 'cee-sistema-data',
//     // address: '127.0.0.1',
//     port: '27017',
//     dbName: 'ceesistema'
// }
// const URI = conn.protocol + conn.address + ":" + conn.port + "/" + conn.dbName;
// // const URI = conn.protocol + conn.user + ':' + conn.password + '@' + conn.address + ":" + conn.port + "/" + conn.dbName;

//     const configuracao = {
//         'useMongoClient': true,
//         "keepAlive": 1 //manter o mongodb acordado
//     };

// // mongoose.Promise = global.Promise;
// //mongoose.connect('mongodb://localhost:27017/ip-frota', {useMongoClient: true});
// mongoose.connect(URI, configuracao);

// module.exports = { Mongoose: mongoose};

import mongoose, { ConnectionOptions } from "mongoose";

const conn = {
    protocol: 'mongodb://',
    user: '', // admin
    password: '', // GE0xJoamuF4y
    // address: 'cee-sistema-data', //para Docker usa-se o nome do servico
    address: 'localhost',
    port: '27017',
    dbName: 'ceesistema'
}

const URI1 = conn.protocol + conn.address + ":" + conn.port + "/" + conn.dbName;
const URI2 = conn.protocol + conn.user + ':' + conn.password + '@' + conn.address + ":" + conn.port + "/" + conn.dbName;
const URI3 = `${conn.protocol}${conn.address}:${conn.port}/${conn.dbName}`;
const URI4 = `${conn.protocol}${conn.user}:${conn.password}@${conn.address}:${conn.port}/${conn.dbName}`;

const configuracao: ConnectionOptions = {
    'useMongoClient': true
};

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

mongoose.connect((conn.user === '') ? URI1 : URI2, configuracao);

export default mongoose;
