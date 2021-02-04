import { model } from "mongoose";

module.exports = async function (app) {

    const data = await model('user').countDocuments({})
    if (data === 0) {
        createFirstGroup();
        createFirstUser();
    }
}

function createFirstGroup() {
    const group = { name: "SuperUser" };
    model('profile').create(group);
}

function createFirstUser() {
    const user = {
        "name": "Super User",
        "email": "super@super",
        "cpf": "1234567890",
        "dataAccess": {
            "password": "1234567890",
            "profiles": [
                "Administrador"
            ],
        },
    };

    const userModel = new model('user')
    userModel(user).save()
}
