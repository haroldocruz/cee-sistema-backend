'use strict'

var express = require('express');
var router = express.Router();

var Auth = require('../../authServices');
var metadata = require('../metadata/metadataCtrl')

module.exports = function (itemName, obj) {
    var itemCtrl = require('./controller')(itemName, obj);

    router.get('/', fnGetAll(itemCtrl));
    router.get('/:id', Auth.isAuthorized, fnGetOne(itemCtrl));
    router.post('/', Auth.isAuthorized, fnSave(itemCtrl));
    router.put('/:id', Auth.isAuthorized, fnUpdate(itemCtrl));
    router.delete('/:id', Auth.isAuthorized, fnRemove(itemCtrl));
    router.post('/filter/', Auth.isAuthorized, fnAllFilter(itemCtrl));
    router.post('/counter/', fnCounter(itemCtrl));
    router.get('/@/:model/', fnJoker(itemCtrl));
    router.get('/@/:model/:id', fnJoker2(itemCtrl));
    router.post('/@/:model/', fnJokerCreate(itemCtrl));

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

function fnJoker(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.jokerFilter(req, (resp) => { res.json(resp) });
    };
}

function fnJoker2(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.jokerFilter2(req, (resp) => { res.json(resp) });
    };
}

function fnJoker2(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.jokerFilter2(req, (resp) => { res.json(resp) });
    };
}

function fnJokerCreate(itemCtrl) {
    return async (req, res, next) => {
        itemCtrl.jokerCreate(req, (resp) => { res.json(resp) });
    };
}