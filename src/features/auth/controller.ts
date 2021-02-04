import { Model, Document, model } from "mongoose";
import { Request } from "express";
import { IUser } from './../../models/User';
import * as MSG from '../../utils/messages';
import Auth, { IAuth } from "../../authServices";
const util = require('../../utils/util');

export interface IAuthCtrl {
    'login': (arg0: Request & IAuth, callback: any) => any;
    'logout': (arg0: Request & IAuth, callback: any) => any;
    'logon': (arg0: Request & IAuth, callback: any) => any;
    'logoff': (arg0: Request & IAuth, callback: any) => any;
}

export default function () {

    const ItemModel = <Model<IUser>>model('user');

    return {
        'login': fnLogIn(ItemModel),
        'logout': fnLogOut(ItemModel),
        'logon': fnLogOn(ItemModel),
        'logoff': fnLogOff(ItemModel),
    }
}

function fnLogIn(User: Model<IUser>) {
    return async (req: Request & IAuth, callback: Function) => {
        console.info("\tUSER_LOGIN");

        const user = await User.findOne({ 'cpf': req.body.cpf }).select('+password');
        autentication(req, <IUser>user, callback)
    }

    async function autentication(req: Request, user: IUser, callback: Function) {
        if (!user) {
            callback(MSG.errUserAbsent)
            return;
        }
        //se a senha estiver correta
        // if (Auth.compareHash(req.body.dataAccess.password, user.dataAccess.password)) { //! REMOVER ESTE
        if (Auth.compareHash(req.body.dataAccess.password, user.dataAccess.passwordHash)) { //? USAR ESTE

            const ipClient = req.connection.remoteAddress || req.socket.remoteAddress;

            user.loginInfo.token = await Auth.generateToken({
                'date': new Date(),
                // 'date': Date.now(),
                '_id': user._id,
                'ipClient': await Auth.encodeTextAES(ipClient),
                'profile': user.dataAccess.profiles[0] ?? 'Administrador', //! REMOVER ESTE
                // 'profile': user.dataAccess.profiles ?? 'Registrado' //? USAR ESTE
                'profiles': await Auth.encodeTextAES(JSON.stringify(user.dataAccess.profiles) ?? 'Registrado')
            });
            user.loginInfo.lastDate = new Date();
            userLoginInfoUpdate(user, callback);
        }
        else {
            callback(MSG.errPass);
        }
    }

    async function userLoginInfoUpdate(user: any, callback: Function) {
        //salva/atualiza o token no usuario db
        // Item.findOneAndUpdate({ '_id': user._id }, user, { upsert: true }, (error) => {
        //     (error) ? callback(MSG.errLogin) : callback(user.loginInfo.token);
        // });

        // const query = await User.updateOne({ '_id': user._id }, user);
        // callback(query) //! trocar
        User.updateOne({ '_id': user._id }, user, (error) => {
            if (error) {
                console.log("USER_LOGIN_ERROR: " + error);
                callback(MSG.errLogin);
            }
            else {
                delete user.password;
                callback(user);
            }
        });
    }
}

function fnLogOut(User: Model<IUser>) {
    return async (req: Request & IAuth, callback: Function) => {
        const loginInfo = { 'loginInfo': { 'token': '' } };
        const update = await User.updateOne({ '_id': req.userId, 'loginInfo': { 'token': req.body.token } }, loginInfo);
        if (update.nModified === 0) {
            callback(MSG.errFind);
            return;
        }
        callback(MSG.msgSuccess);
    }
}

function fnLogOn(User: Model<IUser>) { }

function fnLogOff(User: Model<IUser>) { }