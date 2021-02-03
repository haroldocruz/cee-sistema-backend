'use strict'

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
// import guard from "express-jwt-permissions";

import * as dotenv from "dotenv";
dotenv.config();

const jwt = require('jsonwebtoken');
const bcryptNodejs = require('bcrypt-nodejs');

import { model } from "mongoose";

import { IProfileCtrl } from './features/profile/controller';
import * as MSG from "./utils/messages";

// 2^rounds iterations of processing.
// From @garthk, on a 2GHz core you can roughly expect:
// const SALT_ROUNDS = 5;


export interface dataToToken {
    _id: string;
    role: any;
}

export interface IAuth {
    userId?: string;
    tokenData?: ITokenData;
}

interface ITokenData {
    userId: string;
    date: Date;
    profile: string;
    ipClient: string;
}

export default {
    encodePassword,
    decodePassword,
    generateToken,
    decodeToken,
    guard,
    isAuthorized
}

// async function encodePassword(password: string): Promise<any> {
//     try {
//         var salt = await bcryptNodejs.genSaltSync(9);
//         var hash = await bcryptNodejs.hashSync(password, salt);
//         return hash;
//     } catch (e) { console.log(e) }
// }

/**
 * @description Codifica a string passada
 * @param password String a qual será codificada
 * @returns Retorna uma string codificada
 */
async function encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

/**
 * @description Compara uma string com uma string previamente codificada
 * @param reqPass String a ser comparada com a string previamente codificada
 * @param dataPass String previamente codificada
 * @returns Retorna um valor do tipo boolean (true|false)
 */
async function decodePassword(reqPass: string, dataPass: string): Promise<boolean> {
    return await bcrypt.compare(reqPass, dataPass);
}

//TODO: colocar tempo para expirar o Token (aumentar a segurança)
//TODO: criar um token anexado ao IP para cada conexao (aumentar a segurança)
async function generateToken(data: any): Promise<string> {
    // return jwt.sign(data, global.SALT_KEY, {expiresIn: '1d'});
    // return await jwt.sign(data, process.env.SALT_KEY, { expiresIn: 60 * 60 });
    // return jwt.sign(data, SALT_KEY, { expiresIn: '1h', algorithm: 'HS256' });
    // return await jwt.sign(data, process.env.SALT_KEY, null);
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
    }, process.env.SALT_KEY);
}

/**
 * @description Decodifica o token convertendo para seu estado original
 * @param token {any} Recebe um token (informação codificada)
 * @returns Retorna uma promise do tipo 'qualquer tipo' ( pode ser uma string, objeto)
 */
async function decodeToken(token: string): Promise<any> {
    return await jwt.verify(token, process.env.SALT_KEY);
}

const ROTAS = {
    "GET/user/": { 'groups': ['Administrador', 'Gerente', 'Registrado'], 'description': "Uma descrição aqui" },
    "GET/user/:id": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },
    "POST/user/": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },
    "PUT/user/:id": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },
    "DELETE/user/:id": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },
    "POST/user/filter": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },
    "POST/user/counter": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },

    "POST/auth/logout": { 'groups': ['Administrador', 'Gerente'], 'description': "Uma descrição aqui" },
}
const GROUPS = [{
    'name': "Administrador",
    'context': { name: 'CEE', identify: '' },
    'description': "Uma descrição aqui",
    'routes': [
        "GET/user/",
        "GET/user/:id",
        "POST/user/",
        "PUT/user/:id",
        "DELETE/user/:id",
        "POST/user/filter",
        "POST/user/counter",
        "POST/auth/logout"
    ]
}]

function guard() {

    const _middleware = function _middleware(req: Request & IAuth, res: Response, next: NextFunction): void {
        console.log(req.method + req.baseUrl + req.route.path)
        const routeActual = req.method + req.baseUrl + req.route.path

        // console.log(req.tokenData)
        const profile = req.tokenData.profile;
        // const profile = req.body.profile;

        // required.includes(profile) ? next() : res.status(403).json([false, 'Permission denied'])
        // ROTAS[routeActual]?.groups?.includes(profile) ? next() : res.status(403).json([false, 'Permission denied'])
        GROUPS.find((e) => e.name === profile )?.routes?.includes(routeActual) ? next() : res.status(403).json(MSG.errDenied)
    }

    //Conditionally skip a middleware when a condition is met.
    _middleware.unless = require('express-unless');

    return _middleware;
}

function isAuthorized(req: Request & IAuth, res: Response, next: NextFunction): void {
    console.log(req.method + req.baseUrl + req.route.path)
    const token = req.body.token || req.query.token || req.params.token || req.headers['authorization'] || req.headers['x-access-token'];
    if (!token || token == undefined || token == "") {
        res.status(401).send(MSG.errNoToken);
    } else {
        jwt.verify(token, process.env.SALT_KEY, function (error: any, decoded: any) {
            if (error) {
                console.log("TOKEN_ERROR: " + error)
                res.status(400).send(MSG.errToken);
            } else {
                const ipClient = req.connection.remoteAddress || req.socket.remoteAddress;
                console.log(decoded)
                if (decoded.data.ipClient != ipClient)
                    res.status(409).send(MSG.errToken)
                console.log("UserId: " + JSON.stringify(decoded.data._id), ipClient)
                req.userId = decoded.data._id;
                req.tokenData = decoded.data;
                req.body.token = token;
                next();
            }
        });
    }
}


/**
 * @description Middleware usado para dar permissão de acesso a certo recurso
 * @param required Array com regras
 * @param informed regra a ser verificada
 */
function isAllow(required: Array<string>, informed: string) {
    interface IToken {
        _id: string;
        date: Date;
        profile: string;
    }

    const _middleware = function _middleware(req: Request & IAuth, res: Response, next: NextFunction): void {

        const profile = req.tokenData.profile;

        required.includes(informed) ? next() : res.status(403).json([false, 'Permission denied'])
    }

    //Conditionally skip a middleware when a condition is met.
    _middleware.unless = require('express-unless');

    return _middleware;
}


// function getGroupList() {
//     let ProfileModel:IProfileCtrl = model('profile');
//     ProfileModel.getAll
// }