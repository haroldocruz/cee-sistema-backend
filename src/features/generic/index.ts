import router from "./router";

require('./clearCache')();

module.exports = function (itemName: any, obj: {}) {
    return router(itemName, obj);
}
