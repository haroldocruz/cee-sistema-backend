
require('./clearCache')();

module.exports = function (itemName, obj) {
    return require('./router')(itemName, obj);
}
