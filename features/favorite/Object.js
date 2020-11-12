'use strict'

module.exports = (ObjectId) => {
    return {
        'fk_user': { type: ObjectId, ref: 'user' },
        'fk_goal': { type: ObjectId, ref: 'meta' },
        'fk_strategy': { type: ObjectId, ref: 'estrategia' },
        'fk_action': { type: ObjectId, ref: 'acao' }
    }
}