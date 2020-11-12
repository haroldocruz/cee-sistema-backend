'use strict'

import { model } from "mongoose";

export interface IMetadataCtrl {
    'create': (userId: string, collectionId: string, collectionName: string) => void;
    'update': (metadataId: string, userId: string) => void;
}
module.exports = {
    create,
    update,
    remove
}

/**
 * @description Registra/cria um metadata para uma collection
 * @param {ObjectId} userId Id do usuário logado
 * @param {ObjectId} collectionId Id da collection que está criando a metadata
 * @param {String} collectionName Nome da coleção a qual a metadata sera vinculada
 * @return Não há retorno
 */
function create(userId: string, collectionId: string, collectionName: string): void {

    var MetadataModel = model('metadata');
    var md = metadata(null, userId, collectionId, collectionName);
    var newMetadata = new MetadataModel(md)
    newMetadata.save((error: any) => { (error) ? console.log("METADATA_ERROR: " + error) : undefined })
}

/**
 * @description Atualiza um metadata de uma collection
 * @param {ObjectId} metadataId Id do metadata que será alterado
 * @param {ObjectId} userId Id do usuário logado
 * @return Não há retorno
 */
function update(metadataId: string, userId: string): void {

    var MetadataModel = model('metadata');
    var md = metadata(metadataId, userId);
    MetadataModel.updateOne({ '_id': metadataId }, { $set: md }, (error: any) => { (error) ? console.log("METADATA_ERROR: " + error) : undefined })
}

/**
 * @description Remove um metadata de uma collection
 * @param {ObjectId} metadataId Id do metadata que será alterado
 * @return Não há retorno
 */
function remove(metadataId: string): void {

    var MetadataModel = model('metadata');
    MetadataModel.deleteOne({ '_id': metadataId }, (error: any) => { (error) ? console.log("METADATA_ERROR: " + error) : undefined })
}

function metadata(metadataId: string | null, userId: string, collectionId?: string, collectionName?: string) {

    return {
        '__collectionModel': (!metadataId) ? collectionName : undefined,
        // '_collectionName': (!metadataId) ? collectionName : undefined,
        '_collection': (!metadataId) ? collectionId : undefined,
        '_createdBy': (!metadataId) ? userId : undefined,
        '_createdAt': (!metadataId) ? Date.now() : undefined,
        '_modifiedBy': userId,
        '_lastModifiedAt': Date.now(),
        '_owner': (!metadataId) ? userId : undefined
    }
}