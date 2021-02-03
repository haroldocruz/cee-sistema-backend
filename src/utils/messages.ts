'use strict'

//CONNECTION
export const errConn = [false, 'Erro ao tentar conectar'];
//LOGIN
export const errUserAbsent = [false, 'Usuário não cadastrado'];
export const errPass = [false, 'Senha inválida'];
export const errLogin = [false, 'Erro ao tentar fazer login'];
export const errLowLevel = [false, "Necessário elevar seu nível de acesso para realizar esta ação"];
export const errNoAuth = [false, "Somente usuários autenticados podem realizar esta ação"];
//CONNECT
export const errTokenOrUser = [false, 'Problema com seu token ou usuário'];
export const errToken = [false, 'Token inválido'];
export const errNoToken = [false, 'Acesso restrito'];
//CREATE
export const errMailExist = [false, 'Email já cadastrado'];
export const errSave = [false, 'Erro ao tentar salvar'];
//READ
export const errFind = [false, 'Nenhum dado encontrado'];
//UPDATE
export const errUpd = [false, 'Erro ao tentar atualizar'];
//DELETE
export const errRem = [false, 'Erro ao tentar remover'];
export const errRemNotFound = [false, 'Erro ao tentar remover. Dado não localizado'];
//OTHERS
export const errDenied = [false, 'Permissão negada'];
export const errNoData = [false, 'Nenhum dado enviado'];
export const errNoPermission = [false, 'Usuário não autorizado a realizar esta operação'];
export const msgSuccess = [true, 'Sucesso']

// export default {
//     //CONNECTION
//     errConn,
//     //LOGIN
//     errUserAbsent,
//     errPass,
//     errLogin,
//     errLowLevel,
//     errNoAuth,
//     //CONNECT
//     errTokenOrUser,
//     errToken,
//     errNoToken,
//     //CREATE
//     errMailExist,
//     errSave,
//     //READ
//     errFind,
//     //UPDATE
//     errUpd,
//     //DELETE
//     errRem,
//     //OTHERS
//     errNoData,
//     errNoPermission,
//     msgSuccess
// }