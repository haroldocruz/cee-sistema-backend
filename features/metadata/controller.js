'use strict'

module.exports = function (itemName) {

    var itemModel = require('./model')(itemName);
    const MSG = require('../../utils/messages');
    const util = require('../../utils/util');

    function getOne(id, callback) {
        itemModel.findOne({ '_id': id }, (error, data) => {
            if (error)
                callback(MSG.errCon);
            else if (!data)
                callback(MSG.errFind);
            else
                callback(data);
        })
            .populate({ path: 'estrategia', populate: { path: 'acao' } })
    }

    function getAll(callback) {
        itemModel.find({}, (error, data) => {
            if (error)
                callback(MSG.errCon);
            else if (!data)
                callback(MSG.errFind);
            else
                callback(data);
        })
            .sort('code')
    }

    function save(reqData, callback) {
        var newItem = new item.Model(reqData);
        newItem.save(function (error) {
            if (error)
                callback(MSG.errSave);
            else
                callback(MSG.success);
        });
    }

    function update(reqData, callback) {
        itemModel.findOneAndUpdate({ '_id': reqData._id }, reqData, { upsert: true }, (error) => {
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

    function remove(id, callback) {
        itemModel.findOne({ '_id': id }, function (error) {
            if (error)
                callback(MSG.errCon);
        }).remove(function (error) {
            if (error)
                callback(MSG.errRem);
            else
                callback(MSG.success);
        });
    }

    function allFilter(reqDataFilter, callback) {
        itemModel.find(reqDataFilter, (error, data) => {
            (error || !data) ? callback(MSG.errCon) : callback(data)
        })
    }

    function counter(reqDataFilter, callback) {
        itemModel.count(reqDataFilter).exec((error, data) => {
            (error || !data) ? callback(MSG.errCon) : callback(data)
        });
    }

    return {
        'getOne': getOne,
        'getAll':getAll,
        'save': save,
        'update': update,
        'remove': remove,
        'allFilter': allFilter,
        'counter': counter
    }
}