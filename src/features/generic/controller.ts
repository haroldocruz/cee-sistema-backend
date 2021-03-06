import { Model, Document } from "mongoose";
import { Request } from "express";
import item from "./model";
import * as MSG from '../../utils/messages';
import Auth, { IAuth } from "../../authServices";
const util = require('../../utils/util');
// var metadata = require('../metadata/metadataCtrl')

export interface DocumentCtrl {
    'login': (arg0: Request & IAuth, callback: any) => any;
    // 'changeProfile': (arg0: Request & IAuth, callback: any) => any;
    'getOne': (arg0: Request & IAuth, callback: any) => any;
    'getAll': (arg0: Request & IAuth, callback: any) => any;
    'save': (arg0: Request & IAuth, callback: any) => any;
    'update': (arg0: Request & IAuth, callback: any) => any;
    'remove': (arg0: Request & IAuth, callback: any) => any;
    'allFilter': (arg0: Request & IAuth, callback: any) => any;
    'counter': (arg0: Request & IAuth, callback: any) => any;
}

export default function (itemName: string, obj: {}) {

    const ItemModel = item(itemName, obj);

    return {
        'getOne': getOne(ItemModel),
        'getAll': getAll(ItemModel),
        'save': save(ItemModel),
        'update': update(ItemModel),
        'remove': remove(ItemModel),
        'allFilter': fnAllFilter(),
        'counter': fnCounter(ItemModel)
    }
}

function isValidAccessLevel(accessLevel: string, list: Array<string>) {
    return list.includes(accessLevel);
}

// function fnChangeProfile(User: Model<Document>) {
//     return []
// }


function getOne(ItemModel: Model<Document>) {
    return (req: Request & IAuth, callback: Function) => {
        console.log("\tGENERIC_READ_ONE\n")

        ItemModel.findOne({ '_id': req.params.id }, (error: any, data: any) => { (error || !data) ? callback(MSG.errFind) : callback(data) })
        // .populate({ path: '_indicator', populate: { path: '_critery' } })
    }
}

function getAll(ItemModel: Model<Document>) {
    return (req: Request & IAuth, callback: Function) => {
        console.log("\tGENERIC_READ_ALL\n")

        ItemModel.find({}, (error: any, resp: any) => { (error || !resp) ? callback(MSG.errFind) : callback(resp) })
            // .populate({ path: '_indicator', populate: { path: '_critery' } })
            // .select('order description')
            .sort('order')
    }
}

function save(ItemModel: any) {
    return async (req: any, callback: Function) => {
        console.log("\tGENERIC_CREATE\n")

        var newItem = new ItemModel(req.body);
        await newItem.save(function (error: any) { (error) ? callback(MSG.errSave) : callback(MSG.msgSuccess) });

    }
}

function update(ItemModel: Model<Document>) {
    return async (req: Request & IAuth, callback: Function) => {
        console.log("\tGENERIC_UPDATE\n")
        
        const id = req.body._id || req.params.id;
        await ItemModel.updateOne({ '_id': id }, req.body, {}, (error: any, data: any) => {
            console.log(data);
            (error) ? callback(MSG.errUpd) : (data.nModified) ? callback(MSG.msgSuccess) : callback(MSG.errUpd)
        });

        // metadata.update(req.metadata, req.userId);
        // }
    }
}

function remove(ItemModel: any) {
    return async (req: Request & IAuth, callback: Function) => {
        console.log("\tGENERIC_DELETE\n")

        await ItemModel.deleteOne({ '_id': req.params.id }, function (error: any) {
            (error) ? callback(MSG.errRem) : callback(MSG.msgSuccess);
        });
    }
}

function fnCounter(User: Model<Document>) {
    return (req: Request & IAuth, callback: Function) => {
        User.countDocuments(req.body).exec((error, data) => {
            (error || !data) ? callback(MSG.errConn) : callback(data)
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
                    callback(MSG.errConn);
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