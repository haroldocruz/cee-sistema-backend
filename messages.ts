'use strict'

// module.exports = {
export const messages = {
    //CONNECTION
    'errConn': [false, 'Erro ao tentar conectar'],
    //LOGIN
    'errUserAbsent': [false, 'Usuário não cadastrado'],
    'errPass': [false, 'Senha inválida'],
    'errLogin': [false, 'Erro ao tentar fazer login'],
    'errLowLevel': [false, "Necessário elevar seu nível de acesso para realizar esta ação"],
    'errNoAuth': [false, "Somente usuários autenticados podem realizar esta ação"],
    //CONNECT
    'errToken': [false, 'Token inválido'],
    'errNoToken': [false, 'Acesso restrito'],
    //CREATE
    'errMailExist': [false, 'Email já cadastrado'],
    'errSave': [false, 'Erro ao tentar salvar'],
    //READ
    'errFind': [false, 'Nenhum dado encontrado'],
    //UPDATE
    'errUpd': [false, 'Erro ao tentar atualizar'],
    //DELETE
    'errRem': [false, 'Erro ao tentar remover'],
    //OTHERS
    'errNoData': [false, 'Nenhum dado enviado'],
    'success': [true, 'Sucesso']
};