'use strict'

var metadata = require('../metadata/metadataCtrl')
const MSG = require('../../utils/messages');
const util = require('../../utils/util');

module.exports = function (itemName, obj) {

    var ItemModel = require('./model')(itemName, obj);

    return {
        'getOne': getOne(ItemModel),
        'getAll': getAll(ItemModel),
        'save': save(ItemModel),
        'update': update(ItemModel),
        'remove': remove(ItemModel),
        'allFilter': allFilter(ItemModel),
        'counter': counter(ItemModel)
    }
}

function getOne(ItemModel) {
    return (req, callback) => {
        console.log("\tACCESSLEVEL_READ_ONE\n")

        ItemModel.findOne({ '_id': req.params.id }, (error, data) => { (error || !data) ? callback(MSG.errFind) : callback(data) })
    }
}

function getAll(ItemModel) {
    return (req, callback) => {
        console.log("\tACCESSLEVEL_READ_ALL\n")

        ItemModel.find({})
            .sort('name visibility')
            .exec((error, resp) => { (error || !resp) ? callback(MSG.errFind) : callback(resp) })
    }
}

function save(ItemModel) {
    return async (req, callback) => {
        console.log("\tACCESSLEVEL_CREATE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        // var user = data._doc;

        // switch (user.accessLevel) {
        //     case "ADMINISTRATOR", "SUPERUSER":
        create();
        //         break;
        //     case "EDITOR", "MANAGER", "REGISTERED":
        //         callback(MSG.errLowLevel);
        //         break;
        //     default:
        //         callback(MSG.errNoAuth);
        // }

        async function create() {
            var newItem;
            if (req.file) {
                const { originalname: name, size, filename: key } = req.file;
                newItem = new ItemModel(Object.assign(req.body, { name, size, key }));
            } else {
                newItem = new ItemModel(req.body);
            }
            await newItem.save(function (error) { (error) ? callback(MSG.errSave) : callback(MSG.success) });

            metadata.create(req.userId, newItem._id, "accessLevel");
        }
    }
}

function update(ItemModel) {
    return async (req, callback) => {
        console.log("\tACCESSLEVEL_UPDATE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        switch (user.accessLevel) {
            case "ADMINISTRATOR", "MANAGER", "SUPERUSER":
                update();
                break;
            case "EDITOR", "REGISTERED":
                callback(MSG.errLowLevel);
                break;
            default:
                callback(MSG.errNoAuth);
        }

        async function update() {
            await ItemModel.updateOne({ '_id': req.body._id }, req.body, (error) => {
                (error) ? callback(MSG.errUpd) : callback(MSG.success)
            });

            metadata.update(req.metadata, req.userId);
        }
    }
}

function remove(ItemModel) {
    return async (req, callback) => {
        console.log("\tACCESSLEVEL_DELETE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        switch (user.accessLevel) {
            case "ADMINISTRATOR", "MANAGER", "SUPERUSER":
                remove();
                break;
            case "EDITOR", "REGISTERED":
                callback(MSG.errLowLevel);
                break;
            default:
                callback(MSG.errNoAuth);
        }

        async function remove() {
            await ItemModel.deleteOne({ '_id': req.params.id }, function (error) {
                (error) ? callback(MSG.errRem) : callback(MSG.success);
            });

            metadata.delete(req.metadata);
        }
    }
}

function allFilter(ItemModel) {
    return async (req, callback) => {
        console.log("\tACCESSLEVEL_FILTER\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        switch (user.accessLevel) {
            case "ADMINISTRATOR", "MANAGER", "EDITOR", "SUPERUSER":
                allFilter();
                break;
            case "REGISTERED":
                callback(MSG.errNoPermission)
                break;
            default:
                callback(MSG.errNoAuth)
        }

        function allFilter() {
            ItemModel.find(req.body)
                .sort('name')
                .exec((error, data) => { (error || !data) ? callback(MSG.errCon) : callback(data) })
        }
    }
}

function counter(ItemModel) {
    return (req, callback) => {
        ItemModel.count(req.body, (error, data) => {
            (error || !data) ? callback(MSG.errCon) : callback(data)
        });
    }
}