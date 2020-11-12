'use strict'

var express = require('express');
var router = express.Router();
var multer = require('multer');
var multerConfig = require('./multerConfig');

var Auth = require('../../authServices');

module.exports = function (itemName, obj) {
    var itemCtrl = require('./controller')(itemName, obj);

    router.get('/', fnGetAll(itemCtrl));
    router.get('/:id', Auth.isAuthorized, fnGetOne(itemCtrl));
    router.post('/', multer(multerConfig).single('file'), fnSave(itemCtrl));
    router.put('/:id', Auth.isAuthorized, fnUpdate(itemCtrl));
    router.delete('/:id', Auth.isAuthorized, fnRemove(itemCtrl));
    router.post('/filter/', Auth.isAuthorized, fnAllFilter(itemCtrl));
    router.post('/counter/', fnCounter(itemCtrl));

    return router;
}

function fnGetOne(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.getOne(req, resp => { res.json(resp) });
    };
}

function fnGetAll(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.getAll(req, resp => { res.json(resp) });
    };
}

function fnSave(itemCtrl) {
    return (req, res, next) => {
        console.log(req.file); //! APAGAR
        itemCtrl.save(req, resp => { res.json(resp) });
    };
}

function fnUpdate(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.update(req, resp => { res.json(resp) });
    };
}

function fnRemove(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.remove(req, resp => { res.json(resp) });
    };
}

function fnAllFilter(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.allFilter(req, (resp) => { res.json(resp) });
    };
}

function fnCounter(itemCtrl) {
    return (req, res, next) => {
        itemCtrl.counter(req, (resp) => { res.json(resp); });
    };
}