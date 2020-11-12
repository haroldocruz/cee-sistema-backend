'use strict'

const item = require('./Model.js');
const MSG = require('../../messages');

exports.getOne = (id, callback) => {
    item.Model.findOne({ '_id': id }, (error, data) => {
        if (error)
            callback(MSG.errCon);
        else if (!data)
            callback(MSG.errFind);
        else
            callback(data);
    })
        .populate('fk_goal', 'code')
        .populate('fk_strategy', 'code')
        .populate('fk_action', 'code')
        .populate('fk_user', 'name')
}

exports.getAll = (callback) => {
    item.Model.find({}, (error, data) => {
        if (error)
            callback(MSG.errCon);
        else if (!data)
            callback(MSG.errFind);
        else
            callback(data);
    })
        .populate('fk_goal', 'code')
        .populate('fk_strategy', 'code')
        .populate('fk_action', 'code')
        .populate('fk_user', 'name')
}

exports.save = (reqData, callback) => {
    console.log("ITEM-req -> " + JSON.stringify(reqData));
    var newItem = new item.Model(reqData);
    newItem.save(function (error) {
        if (error)
            callback(MSG.errSave);
        else
            callback(MSG.success);
    });
}

exports.update = (id, reqData, callback) => {
    console.log("ITEM-req -> " + JSON.stringify(reqData));
    item.Model.findOneAndUpdate({ '_id': id }, reqData, { upsert: true }, (error) => {
        if (error) {
            console.log("ERRO: " + error)
            callback(MSG.errUpd);
        }
        else {
            console.log("SUCESSO:")
            callback(MSG.success);
        }
    });
}

exports.remove = (id, callback) => {
    item.Model.findOne({ '_id': id }, function (error) {
        if (error)
            callback(MSG.errCon);
    }).remove(function (error) {
        if (error)
            callback(MSG.errRem);
        else
            callback(MSG.success);
    });
}

exports.allFilter = (reqDataFilter, callback) => {
    item.Model.find(reqDataFilter, (error, data) => {
        if (error)
            callback(MSG.errCon);
        else if (!data)
            callback(MSG.errFind);
        else
            callback(data);
    })
}

exports.counter = (reqDataFilter, callback) => {
    item.Model.find(reqDataFilter, (error, data) => {
        if (error)
            callback(MSG.errCon);
        else if (!data)
            callback(MSG.errFind);
        else
            callback(data.length);
    }).exec();
}