'use strict'

const MSG = require('../../utils/messages');
const util = require('../../utils/util');
// const Auth = require('../../authServices');
import Auth, { IAuth } from "../../authServices";
var metadata = require('../metadata/metadataCtrl')

// interface IUserCtrl {
//     'login': (arg0: Request & IAuth, callback: any) => any;
//     'changeProfile': (arg0: Request & IAuth, callback: any) => any;
//     'getOne': (arg0: Request & IAuth, callback: any) => any;
//     'getAll': (arg0: Request & IAuth, callback: any) => any;
//     'save': (arg0: Request & IAuth, callback: any) => any;
//     'update': (arg0: Request & IAuth, callback: any) => any;
//     'remove': (arg0: Request & IAuth, callback: any) => any;
//     'allFilter': (arg0: Request & IAuth, callback: any) => any;
//     'counter': (arg0: Request & IAuth, callback: any) => any;
// }

import ItemModel from "./model";
import { IUser, IUserBase } from "./User";
import { Model, Document } from "mongoose";
import { Request } from "express";
const User = ItemModel('user')

// module.exports = function (itemName, obj) {
module.exports = function () {

    // var ItemModel = require('./model')(itemName, obj);

    return {
        'login': fnLogin(User),
        'changeProfile': fnChangeProfile(User),
        'getOne': fnGetOne(User),
        'getAll': fnGetAll(User),
        'save': fnSave(User),
        'update': fnUpdate(User),
        'remove': fnRemove(User),
        'allFilter': fnAllFilter(),
        'counter': fnCounter(User)
    }
}

function isValidAccessLevel(accessLevel: string, list: Array<string>) {
    return list.includes(accessLevel);
}

function fnChangeProfile(User: Model<Document>) {

}

function fnGetOne(User: Model<Document>) {
    return (id: string, callback: Function) => {
        console.log("\tUSER_READ_ONE");

        User.findOne({ '_id': id }, (error, data) => { (error || !data) ? callback(MSG.errFind) : callback(data) })
    };
}

function fnGetAll(User: Model<Document>) {
    return (callback: Function) => {
        console.log("\tUSER_READ_ALL");

        User.find({}, (error, resp) => { (error || !resp) ? callback(MSG.errFind) : callback(resp) })
            .sort('name')
    }
}

function fnSave(User: Model<Document>) {
    return async (req: Request & IAuth, callback: Function) => {
        console.log("\tUSER_CREATE");

        var newItem = new User(req.body);
        await newItem.save((error) => { (error) ? callback(MSG.errSave) : callback(MSG.success) });

        // metadata.create(req.userId, newItem._id, "user");

    }
}

function fnUpdate(User: Model<Document>) {
    return async (req: Request & IAuth, callback: Function) => {
        console.log("\tUSER_UPDATE");

        await User.updateOne({ '_id': req.body._id }, req.body, (error) => {
            (error) ? console.log(error) : callback(MSG.success)
        });
    }
}

function fnRemove(User: Model<Document>) {
    return async (req: Request & IAuth, callback: Function) => {
        console.log("\tUSER_DELETE");

        await User.deleteOne({ '_id': req.params.id }, function (error) {
            (error) ? callback(MSG.errRem) : callback(MSG.success);
        });
    }
}

function fnLogin(User: Model<Document>) {
    return async (req: Request & IAuth, callback: Function) => {
        console.log("\tUSER_LOGIN");

        const user = await User.findOne({ 'cpf': req.body.cpf }).select('+password');
        autentication(req.body, <IUser>user, callback)
    }

    async function autentication(reqData: IUser, user: IUser, callback: Function) {
        if (!user)
            callback(MSG.errUserAbsent)
        else {
            //se a senha estiver correta
            if (Auth.decodePassword(reqData.dataAccess.password, user.dataAccess.passwordHash)) {
                // if (reqData.password == user.dataAccess.password) {
                //gerar um token para a conexao
                // user.loginInfo.token = Auth.generateToken(user.email);
                user.loginInfo.token = await Auth.generateToken({
                    'date': Date.now(),
                    '_id': user._id,
                    'profile': Auth.generateToken(user.profiles ?? 'Registrado')
                });
                userLoginInfoUpdate(user, callback);
            }
            else {
                callback(MSG.errPass);
            }
        }
    }

    function userLoginInfoUpdate(user: any, callback: Function) {
        //salva/atualiza o token no usuario db
        // Item.findOneAndUpdate({ '_id': user._id }, user, { upsert: true }, (error) => {
        //     (error) ? callback(MSG.errLogin) : callback(user.loginInfo.token);
        // });

        const query = User.updateOne({ '_id': user._id }, user);
        callback(query) //! trocar
        // User.updateOne({ '_id': user._id }, user, (error) => {
        //     if (error) {
        //         console.log("USER_LOGIN_ERROR: " + error);
        //         callback(MSG.errLogin);
        //     }
        //     else {
        //         delete user.password;
        //         callback(user);
        //     }
        // });
    }
}

function fnCounter(User: Model<Document>) {
    return (req: Request & IAuth, callback: Function) => {
        User.countDocuments(req.body).exec((error, data) => {
            (error || !data) ? callback(MSG.errCon) : callback(data)
        });
    }
}

function fnAllFilter() {
    return (reqDataFilter: any, callback: Function) => {
        console.log("\tUSER_ALL_FILTER -> " + JSON.stringify(reqDataFilter));
        var UserModel = require('mongoose').model('user');
        // var AddressModel = require('mongoose').model('address');
        // var VacancyModel = require('mongoose').model('vacancy');
        // var address = AddressModel.find({
        //     "city": { "$regex": reqDataFilter.address.city, "$options": "i" },
        //     "uf": { "$regex": reqDataFilter.address.uf, "$options": "i" }
        // });
        // var vacancy = VacancyModel.find({
        //     "office": { "$regex": reqDataFilter.vacancy.office, "$options": "i" }
        // });
        // UserModel.find({})
        // .populate('professionalExperience')
        UserModel.find({ "name": { "$regex": reqDataFilter.user.name, "$options": "i" } })
            // .populate({
            //     path: 'vacancy', model: 'vacancy', match: {
            //         "office": { "$regex": reqDataFilter.vacancy.office, "$options": "i" }
            //     }
            // })
            // .populate({
            //     path: 'address', model: 'address', match: {
            //         "city": { "$regex": reqDataFilter.address.city, "$options": "i" },
            //         "uf": { "$regex": reqDataFilter.address.uf, "$options": "i" }
            //     }
            // })
            .populate('professionalExperience')
            .populate('vacancy')
            .populate('address')
            // .where("name", /^haroldo/i)
            .sort("name")
            .exec((error: any, data: any) => {
                if (error) {
                    console.log("ERRO: " + error);
                    callback(MSG.errCon);
                }
                else if (data.length === 0)
                    callback(MSG.errFind);
                else {
                    var data2: any;
                    if (reqDataFilter.vacancy !== undefined && data[0].vacancy !== undefined) {
                        var data2 = data;
                        if (util.invalidField(reqDataFilter.vacancy.office))
                            data = data2.filter((item: any) => {
                                if (item.vacancy.office)
                                    return (item.vacancy.office.toLowerCase().indexOf(reqDataFilter.vacancy.office.toLowerCase()) !== -1) ? true : false;
                            });
                        if (data.length === 0) {
                            callback(MSG.errFind);
                            return;
                        }
                    }
                    if (reqDataFilter.address !== undefined && data[0].address !== undefined) {
                        data2 = data;
                        if (util.invalidField(reqDataFilter.address.city))
                            data = data2.filter((item: any) => {
                                if (item.address.city)
                                    return (item.address.city.toLowerCase().indexOf(reqDataFilter.address.city.toLowerCase()) !== -1) ? true : false;
                            });
                        if (data.length === 0) {
                            callback(MSG.errFind);
                            return;
                        }
                        data2 = data;
                        if (util.invalidField(reqDataFilter.address.uf))
                            data = data2.filter((item: any) => {
                                if (item.address.uf)
                                    return (item.address.uf.toLowerCase().indexOf(reqDataFilter.address.uf.toLowerCase()) !== -1) ? true : false;
                            });
                        if (data.length === 0) {
                            callback(MSG.errFind);
                            return;
                        }
                    }
                    callback(data);
                }
            });
    };
}