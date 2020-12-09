'use strict'

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import guard from "express-jwt-permissions";

import * as dotenv from "dotenv";
dotenv.config();

const jwt = require('jsonwebtoken');
const bcryptNodejs = require('bcrypt-nodejs');

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
    tokenDecoded?: any;
}

export default {
    encodePassword,
    decodePassword,
    generateToken,
    decodeToken,
    isPermitted,
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
    // return jwt.sign(data, SALT_KEY, {expiresIn: 86400});
    // return jwt.sign(data, SALT_KEY, { expiresIn: '1h', algorithm: 'HS256' });
    return await jwt.sign(data, process.env.SALT_KEY, null);
}

/**
 * @description Decodifica o token convertendo para seu estado original
 * @param token {any} Recebe um token (informação codificada)
 * @returns Retorna uma promise do tipo 'qualquer tipo' ( pode ser uma string, objeto)
 */
async function decodeToken(token: string): Promise<any> {
    return await jwt.verify(token, process.env.SALT_KEY);
}

function isPermitted(required: Array<string>) {
    interface IToken {
        _id: string;
        date: Date;
        profile: string;
    }
    
    const _middleware = function _middleware(req: Request & IAuth, res: Response, next: NextFunction): void {

        const profile = req.tokenDecoded.profile;

        required.includes(profile) ? next() : res.status(403).json([false, 'Permission denied'])
    }

    //Conditionally skip a middleware when a condition is met.
    _middleware.unless = require('express-unless');

    return _middleware;
}

function isAuthorized(req: Request & IAuth, res: Response, next: NextFunction): void {
    const token = req.body.token || req.params.token || req.headers['Authorization'] || req.headers['x-access-token'];
    if (!token || token == undefined || token == "") {
        // res.status(401).send(MSG.errNoToken);
        res.send(MSG.errNoToken);
    } else {
        jwt.verify(token, process.env.SALT_KEY, function (error: any, decoded: any) {
            if (error) {
                console.log("TOKEN_ERROR: " + error)
                // res.status(401).send(MSG.errToken);
                res.send(MSG.errToken);
            } else {
                console.log("UserId: " + JSON.stringify(decoded._id))
                req.userId = decoded._id;
                req.tokenDecoded = decoded;
                next();
            }
        });
    }
}