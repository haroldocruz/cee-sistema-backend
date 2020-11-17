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
        'counter': counter(ItemModel),
        'jokerFilter': jokerFilter(ItemModel),
        'jokerFilter2': jokerFilter2(ItemModel),
        'jokerCreate': jokerCreate(),
        'jokerDeleteAll': jokerDeleteAll()
    }
}

function jokerDeleteAll() {
    return async (req, callback) => {
        console.log("\tJOKER_DELETE_ALL\n")

        var Model = require('mongoose').model('meta')
        await Model.delete({}, function (error) {});
        Model = require('mongoose').model('estrategia')
        await Model.delete({}, function (error) {});
        Model = require('mongoose').model('acao')
        await Model.delete({}, function (error) {});

    }
}

function getOne(ItemModel) {
    return (req, callback) => {
        console.log("\tGENERIC_READ_ONE\n")

        ItemModel.findOne({ '_id': req.params.id }, (error, data) => { (error || !data) ? callback(MSG.errFind) : callback(data) })
            .populate({ path: 'fk_strategy', select: 'code' })
    }
}

function getAll(ItemModel) {
    return (req, callback) => {
        console.log("\tGENERIC_READ_ALL\n")

        ItemModel.find({}, (error, resp) => { (error || !resp) ? callback(MSG.errFind) : callback(resp) })
            .sort('code')
    }
}

function save(ItemModel) {
    return async (req, callback) => {
        console.log("\tGENERIC_CREATE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        if (user)
            switch (user.accessLevel) {
                case "ADMINISTRATOR":
                    create();
                    break;
                case "EDITOR" || "MANAGER" || "REGISTERED":
                    callback(MSG.errLowLevel);
                    break;
                default:
                    callback(MSG.errNoAuth);
            }
        else
            callback(MSG.errToken);

        async function create() {
            var newItem = new ItemModel(req.body);
            await newItem.save(function (error) { (error) ? callback(MSG.errSave) : callback(MSG.success) });

            metadata.create(req.userId, newItem._id, "meta");
        }
    }
}

function update(ItemModel) {
    return async (req, callback) => {
        console.log("\tGENERIC_UPDATE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        if (user)
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER":
                    update();
                    break;
                case "EDITOR" || "REGISTERED":
                    callback(MSG.errLowLevel);
                    break;
                default:
                    callback(MSG.errNoAuth);
            }
        else
            callback(MSG.errToken);

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
        console.log("\tGENERIC_DELETE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        if (user)
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER":
                    remove();
                    break;
                case "EDITOR" || "REGISTERED":
                    callback(MSG.errLowLevel);
                    break;
                default:
                    callback(MSG.errNoAuth);
            }
        else
            callback(MSG.errToken);

        async function remove() {
            await ItemModel.deleteOne({ '_id': req.params.id }, function (error) {
                (error) ? callback(MSG.errRem) : callback(MSG.success);
            });

            metadata.delete(req.metadata);
        }
    }
}

function allFilter(ItemModel) {
    return (req, callback) => {
        console.log("\tGENERIC_FILTER\n")

        switch (user.accessLevel) {
            case "ADMINISTRATOR" || "MANAGER" || "EDITOR":
                allFilter();
                break;
            case "REGISTERED":
                callback(MSG.errNoPermission)
                break;
            default:
                callback(MSG.errNoAuth)
        }

        function allFilter() {
            ItemModel.find(req.body, (error, data) => {
                (error || !data) ? callback(MSG.errCon) : callback(data)
            }).sort('code');
        }
    }
}

function counter(ItemModel) {
    return (req, callback) => {
        ItemModel.countDocuments(req.body).exec((error, data) => {
            (error || !data) ? callback(MSG.errCon) : callback(data)
        });
    }
}

function jokerFilter(ItemModel) {
    return async (req, callback) => {
        console.log("\tGENERIC_JOKER_FILTER\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        switch (user.accessLevel) {
            case "SUPERUSER":
                joker();
                break;
            default:
                callback(MSG.errNoPermission);
        }

        function joker() {
            var JokerModel = require('mongoose').model(req.params.model);
            JokerModel.find({}, (error, data) => {
                (error || !data) ? callback(MSG.errCon) : callback(data)
            });
        }
    }
}

function jokerFilter2(ItemModel) {
    return async (req, callback) => {
        console.log("\tGENERIC_JOKER_FILTER\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        switch (user.accessLevel) {
            case "SUPERUSER":
                joker();
                break;
            default:
                callback(MSG.errNoPermission);
        }

        function joker() {
            JokerModel.findOne({ '_id': req.params.id }, (error, data) => { (error || !data) ? callback(MSG.errFind) : callback(data) })
        }
    }
}

function jokerCreate() {
    return async (req, callback) => {
        console.log("\tGENERIC_JOKER_CREATE\n")
        console.log(req)

        var JokerModel = require('mongoose').model(req.params.model);
        var newItem = new JokerModel(req.body);
        await newItem.save(function (error) { (error) ? callback(MSG.errSave) : callback(MSG.success) });
    }
}