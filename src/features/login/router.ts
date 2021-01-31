import express, { NextFunction, Request, Response } from 'express';
import Auth, { IAuth } from './../../authServices';
import { IUser } from './../../models/User';
import controller, { IUserCtrl } from './controller';

var router = express.Router();

export default function (itemName: string) {
    var itemCtrl = controller(itemName);

    const ALLOWS = ['SuperUser', 'Administrador', 'Técnicos']

    router.post('/login', fnLogIn(itemCtrl));
    router.post('/logout', Auth.isAuthorized, fnLogOut(itemCtrl));
    router.post('/logon', Auth.isAuthorized, fnLogOn(itemCtrl));
    router.post('/logoff', Auth.isAuthorized, fnLogOff(itemCtrl));

    return router;
}

function fnLogIn(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.login(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnLogOut(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.login(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnLogOn(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.login(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnLogOff(itemCtrl: IUserCtrl) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.login(req, (resp: IUser) => { res.json(resp) });
    };
}
