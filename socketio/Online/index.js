const Online = require("../../models/online");
const User = require("../../models/user");

const online = async (user) => {

    const newOnline = new Online({iduser: user.iduser, displayname: user.displayname});

    await newOnline.save();

    const listUser = await Online.find({});
    
    return listUser;
}

const offline = (user) => {
    Online.findOneAndDelete({iduser: user}, function(err, docs) {
        if(err) console.log(err) 
        else return;
    });
}

module.exports = {
    online,
    offline
}