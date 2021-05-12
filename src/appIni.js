import { model } from "mongoose";

module.exports = async function (app) {

    const data = await model('user').countDocuments({})
    if (data === 0) {
        await createRouteList();
        await createFirstProfile();
        await createFirstUser();
    }
}

async function createRouteList() {
    const routeList = [
        { "context": "organ_system", "status": true, "urn": "GET/user/", "description": "" },
        { "context": "organ_system", "status": true, "urn": "GET/user/:id", "description": "" },
        { "context": "organ_system", "status": true, "urn": "POST/user/", "description": "" },
        { "context": "organ_system", "status": true, "urn": "PUT/user/:id", "description": "" },
        { "context": "organ_system", "status": true, "urn": "DELETE/user/:id", "description": "" },
        { "context": "organ_system", "status": true, "urn": "POST/user/filter", "description": "" },
        { "context": "organ_system", "status": true, "urn": "POST/user/counter", "description": "" },
        { "context": "organ_system", "status": true, "urn": "POST/auth/logout", "description": "" }
    ]

    await model('route').insertMany(routeList, function (error, docs) { });

    // routeList.forEach(element => {
    //     await model('route').create(element);
    // });
}

async function createFirstProfile() {

    const routeList = await model('route').find();

    const profile = {
        "status": true,
        "name": "SuperUser",
        "context": "organ_system",
        "description": "The superuser is a special user account used for system administration",
        "routeList": routeList
    };

    await model('profile').create(profile);
}

async function createFirstUser() {

    const profileList = await model('profile').find();

    const user = {
        "status": true,
        "name": "Super User",
        "cpf": 12345678909,
        "contact": {
            "emailList": [{ "address": "super@super.com" }],
            "phoneList": [{ "number": 5563984589691 }],
            "addressList": [{ "country": "Brasil", "state": "Tocantins", "zipcode": 77062060 }]
        },
        "dataAccess": {
            "password": "12345678909",
            "profileDefault": profileList[0]._id,
            "profileList": profileList,
        },
    };

    const userModel = new model('user');
    userModel(user).save();
}
