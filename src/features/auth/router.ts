import express, { NextFunction, Request, Response } from 'express';
import Auth, { IAuth } from './../../authServices';
import { IUser } from './../../models/User';
import controller, { IAuthCtrl } from './controller';

var router = express.Router();

export default function (itemName: string) {
    var itemCtrl = controller();

    router.post('/login', fnLogIn(itemCtrl));
    router.post('/logout', Auth.isAuthorized, fnLogOut(itemCtrl));
    router.post('/logon', Auth.isAuthorized, fnLogOn(itemCtrl));
    router.post('/logoff', Auth.isAuthorized, fnLogOff(itemCtrl));

    return router;
}

function fnLogIn(itemCtrl: any) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.login(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnLogOut(itemCtrl: any) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.logout(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnLogOn(itemCtrl: any) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.logon(req, (resp: IUser) => { res.json(resp) });
    };
}

function fnLogOff(itemCtrl: any) {
    return (req: Request & IAuth, res: Response, next: NextFunction) => {
        itemCtrl.logoff(req, (resp: IUser) => { res.json(resp) });
    };
}
