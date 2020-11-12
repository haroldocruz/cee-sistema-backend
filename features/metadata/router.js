'use strict'

var express = require('express');
var router = express.Router();

var auth = require('../../authServices');

module.exports = function (itemName) {
    var itemCtrl = require('./controller')(itemName);

    router.get('/', async (req, res, next) => {
        itemCtrl.getAll(resp => { res.json(resp); });
    });

    router.get('/:id', auth.isAuthorized, async (req, res, next) => {
        var UserModel = require('mongoose').model('user');
        var user = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')

        // var MetaModel = require('mongoose').model('meta');
        itemCtrl.getOne(req.params.id, resp => {
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER" || "EDITOR":
                    res.json(resp);
                    break;
                default:
                    res.json({ success: false, message: "Somente usuários autenticados podem realizar esta ação" });
            }
        });
    });

    // SAVE
    router.post('/', auth.isAuthorized, async (req, res, next) => {
        var UserModel = require('mongoose').model('user');
        var user = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')

        // var MetaModel = require('mongoose').model('meta');
        itemCtrl.save(req.body, resp => {
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER":
                    res.json(resp);
                    break;
                case "EDITOR":
                    res.json({ success: false, message: "Necessário elevar seu nível de acesso para realizar esta ação" });
                    break;
                default:
                    res.json({ success: false, message: "Somente usuários autenticados podem realizar esta ação" });
            }
        });

        metadata.create(req.userId, itemCtrl._id, "meta");
    });

    //UPDATE
    router.put('/:id', auth.isAuthorized, async (req, res, next) => {
        var UserModel = require('mongoose').model('user');
        var user = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')

        // var MetaModel = require('mongoose').model('meta');
        itemCtrl.update(req.params.id, req.body, resp => {
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER":
                    res.json(resp);
                    break;
                case "EDITOR":
                    res.json({ success: false, message: "Necessário elevar seu nível de acesso para realizar esta ação" });
                    break;
                default:
                    res.json({ success: false, message: "Somente usuários autenticados podem realizar esta ação" });
            }
        });

        metadata.update(req.metadata, req.userId);
    });

    router.delete('/:id', auth.isAuthorized, async (req, res, next) => {
        var UserModel = require('mongoose').model('user');
        var user = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')

        // var MetaModel = require('mongoose').model('meta');
        itemCtrl.remove(req.params.id, resp => {
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER":
                    res.json(resp);
                    break;
                case "EDITOR":
                    res.json({ success: false, message: "Necessário elevar seu nível de acesso para realizar esta ação" });
                    break;
                default:
                    res.json({ success: false, message: "Somente usuários autenticados podem realizar esta ação" });
            }
        });

        metadata.delete(req.metadata);
    });

    router.post('/filter/', auth.isAuthorized, async (req, res, next) => {
        var UserModel = require('mongoose').model('user');
        var user = await UserModel.findOne({ '_id': req.userId }).select('accessLevel')

        // var MetaModel = require('mongoose').model('meta');
        itemCtrl.allFilter(req.body, (resp) => {
            switch (user.accessLevel) {
                case "ADMINISTRATOR" || "MANAGER" || "EDITOR":
                    res.json(resp);
                    break;
                default:
                    res.json({ success: false, message: "Somente usuários autenticados podem realizar esta ação" });
            }
        });
    });

    router.post('/counter/', (req, res, next) => {
        itemCtrl.counter(req.body, (resp) => { res.json(resp) });
    });
    
    return router;
}