import { model } from "mongoose";

module.exports = async function (app) {

    const data = await model('user').countDocuments({})
    if (data === 0) {
        await createFirstGroup();
        await createFirstUser();
    }
}

async function createFirstGroup() {
    const group = {
        "status": true,
        "name": "SuperUser",
        "context": "CEE",
        "description": "The superuser is a special user account used for system administration",
        "routes": [
            { "urn": "GET/user/", "description": "" },
            { "urn": "GET/user/:id", "description": "" },
            { "urn": "POST/user/", "description": "" },
            { "urn": "PUT/user/:id", "description": "" },
            { "urn": "DELETE/user/:id", "description": "" },
            { "urn": "POST/user/filter", "description": "" },
            { "urn": "POST/user/counter", "description": "" },
            { "urn": "POST/auth/logout", "description": "" }
        ]
    };
    await model('group').create(group);
}

async function createFirstUser() {

    const groups = await model('group').find();

    const user = {
        "status": true,
        "name": "Super User",
        "cpf": "1234567890",
        "contact": {
            "emailList": [{ "address": "super@super" }],
            "phoneList": [{ "number": 5563984589691 }],
            "addressList": [{ "country": "Brasil", "state": "Tocantins", "zipcode":"77062060" }]
        },
        "dataAccess": {
            "password": "1234567890",
            "group": groups[0]._id,
            "groupList": groups,
        },
    };

    const userModel = new model('user')
    userModel(user).save()
}
