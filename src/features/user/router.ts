import express, { NextFunction, Request, Response } from 'express';
import { model } from 'mongoose';
import Auth, { IAuth } from '../../authServices';
import { IUser } from './../../models/User';
import controller, { IUserCtrl } from './controller';

var router = express.Router();

// var metadata = require('../metadata/metadataCtrl')

// module.exports = function (itemName, obj) {
export default function (itemName: string) {
    var itemCtrl = controller(itemName);

    // model('group').find({"role": {$in: []}})

    const ALLOWS = ['SuperUser', 'Administrador', 'Técnicos']

    router.post('/login', fnLogin(itemCtrl));
    // router.get('/', fnGetAll(itemCtrl));
    // router.get('/:id', fnGetOne(itemCtrl));
    // router.post('/', fnSave(itemCtrl));
    // router.put('/:id', fnUpdate(itemCtrl));
    // router.delete('/:id', fnRemove(itemCtrl));
    // router.post('/filter/', fnAllFilter(itemCtrl));
    // router.post('/counter/', fnCounter(itemCtrl));
    router.get('/', Auth.isAuthorized, fnGetAll(itemCtrl));
    router.get('/:id', Auth.isAuthorized, fnGetOne(itemCtrl));
    router.post('/', Auth.isAuthorized, fnSave(itemCtrl));
    router.put('/:id', Auth.isAuthorized, fnUpdate(itemCtrl));
    router.delete('/:id', Auth.isAuthorized, fnRemove(itemCtrl));
    router.post('/filter/', Auth.isAuthorized, fnAllFilter(itemCtrl));
    router.post('/counter/', Auth.isAuthorized, fnCounter(itemCtrl));

    return router;
}

function fnLogin(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.login(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnGetOne(itemCtrl: IUserCtrl) {
    return async (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.getOne(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnGetAll(itemCtrl: IUserCtrl) {
    return async (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.getAll(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnSave(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.save(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnUpdate(itemCtrl: IUserCtrl) {
    return async (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.update(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnRemove(itemCtrl: IUserCtrl) {
    return async (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.remove(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnAllFilter(itemCtrl: IUserCtrl) {
    return async (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.allFilter(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnCounter(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.counter(req, (resp: IUser) => { res.json(resp); });
    };
}