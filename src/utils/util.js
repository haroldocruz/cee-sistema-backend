


module.exports = {
    "filters": filters,
    "invalidField": invalidField,
    "percentual": percentual,
    "toggle": toggle,
    "removeAccents": removeAccents
}

function toggle(validate) {
    return (validate) ? false : true;
};

function percentual(qtd, done) {
    return parseFloat(((done * 100) / (qtd)).toFixed(1));
};

function invalidField(field) {
    return (field !== undefined && field !== null && field !== "") ? true : false;
}

/**
 * @description Filtra uma lista retornando apenas os item equivalentes da pesquisa. Obs: Esta função ignora automaticamente os acentos.
 * @param {String} string Texto/string a ser pesquisado no array
 * @param {Array} objList Lista que será feito a busca
 * @param {Object} options Opções de busca (caseSesitive, global)
 * @returns Retorna uma lista dos itens encontrados
 */
function filters(string, objList, options) {
    string = removeAccents(string)
    let i = options.caseSensitive? 'i' : '';
    let g = options.global? 'g' : '';
    
    let list = objList.filter((e)=> new RegExp('\w*'+string, i+g).test(removeAccents(e)));
    return list;
}

/**
 * @description Remove acentuações das letras (A,a,E,e,I,i,O,o,U,u,N,n,C,c)
 * @param {String} source Texto a ser alterado
 * @returns Retorna o texto inserido sem letras acentuadas
 */
function removeAccents(source) {
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g  // C, c
    ],
        noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    for (var i = 0; i < accent.length; i++) {
        source = source.replace(accent[i], noaccent[i]);
    }

    return source;
}