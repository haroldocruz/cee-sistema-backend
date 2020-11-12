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
        console.log("\tEVIDENCIA_READ_ONE\n")

        ItemModel.findOne({ '_id': req.params.id }, (error, data) => { (error || !data) ? callback(MSG.errFind) : callback(data) })
    }
}

function getAll(ItemModel) {
    return (req, callback) => {
        console.log("\tEVIDENCIA_READ_ALL\n")

        ItemModel.find({}, (error, resp) => { (error || !resp) ? callback(MSG.errFind) : callback(resp) })
            .sort('tipo')
    }
}

function save(ItemModel) {
    return async (req, callback) => {
        console.log("\tEVIDENCIA_CREATE\n")

        var UserModel = require('mongoose').model('user');
        var data = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')
        var user = data._doc;

        switch (user.accessLevel) {
            case "ADMINISTRATOR", "SUPERUSER":
                create();
                break;
            case "EDITOR", "MANAGER", "REGISTERED":
                callback(MSG.errLowLevel);
                break;
            default:
                callback(MSG.errNoAuth);
        }

        async function create() {
            console.log(req.body) //!APAGAR
            var newItem;
            if (req.file) {
                const { originalname: name, size, filename: key } = req.file;
                newItem = new ItemModel(Object.assign(req.body, { name, size, key }));
            } else {
                newItem = new ItemModel(req.body);
            }

            await newItem.save(function (error) { (error) ? callback(MSG.errSave) : callback(MSG.success) });

            var AcaoModel = require('mongoose').model('acao');
            AcaoModel.updateOne({ '_id': req.body._acao }, { $push: { '_evidencia': newItem._id } }, (error) => {
                (error) ? console.log("EVIDENCIA_C_ACAO_U_ERROR: " + error) : console.log("EVIDENCIA_C_ACAO_U_OK");
            });

            metadata.create(req.userId, newItem._id, "evidencia");
        }
    }
}

function update(ItemModel) {
    return async (req, callback) => {
        console.log("\tEVIDENCIA_UPDATE\n")

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
        console.log("\tEVIDENCIA_DELETE\n")

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

            console.log("================" + JSON.stringify(req.body)) //!APAGAR
            var AcaoModel = require('mongoose').model('acao');
            AcaoModel.updateOne({ '_id': req.body._acao }, { $pull: { '_evidencia': req.params.id } }, (error) => {
                (error) ? console.log("EVIDENCIA_D_ACAO_U_ERROR: " + error) : console.log("EVIDENCIA_D_ACAO_U_OK");
            });

            metadata.delete(req.metadata);
        }
    }
}

function allFilter(ItemModel) {
    return async (req, callback) => {
        console.log("\tEVIDENCIA_FILTER\n")

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
            ItemModel.find(req.body, (error, data) => { (error || !data) ? callback(MSG.errCon) : callback(data) })
            .sort('tipo');
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