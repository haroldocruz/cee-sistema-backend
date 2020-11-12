'use strict'

var express = require('express');
var router = express.Router();

var itemCtrl = require('./Controller');

router.get('/', (req, res, next) => {
    itemCtrl.getAll(resp => { res.json(resp) });
});

router.get('/:id', (req, res, next) => {
    itemCtrl.getOne(req.params.id, resp => { res.json(resp) });
});

router.post('/', (req, res, next) => {
    itemCtrl.save(req.body, resp => { res.json(resp) });
});

router.put('/:id', (req, res, next) => {
    itemCtrl.update(req.params.id, req.body, resp => { res.json(resp) });
});

router.delete('/:id', (req, res, next) => {
    itemCtrl.remove(req.params.id, resp => { res.json(resp) });
});

router.post('/filter/', (req, res, next) => {
        itemCtrl.allFilter(req.body, (resp) => { res.json(resp) });
});

router.post('/counter/', (req, res, next) => {
        itemCtrl.counter(req.body, (resp) => { res.json(resp) });
});

module.exports = router;
