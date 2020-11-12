'use strict'

module.exports = (ObjectId) => {
    return {
        'fk_goal': { type: ObjectId, ref: 'meta' },

        'law': { type: String }, //lei do pee
        'forecast': { type: String }, //periodo previsto
        'yearFisrtEvaluation': { type: String }, //ano da primeira avaliacao
        'coordCommittee': { // comissao coordenadora
            'name': { type: String }, //nome dado a comissao coordenadora
            'legalAct': { type: String } //ato legal
        },
        'tecnicalTeam': { //equipe tecnica
            'name': { type: String }, //nome dado a equipe tecnica
            'legalAct': { type: String } //ato legal
        },
        'contact': {
            'description': [{ type: String }], //responsavel|direcao|departamento|setor|contato da comissao do pee
            'phone': [{ type: String }], //telefone de contato da comissao do pee
            'email': [{ type: String }] //email de contato da comissao do pee
        },
        'members': [{
            'user': { type: ObjectId, ref: 'user' },
            'category': { type: ObjectId, ref: 'category' }
        }],
        'metadata': { type: ObjectId, ref: 'metadata' }
    }
}