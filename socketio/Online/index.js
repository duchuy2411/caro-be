const Online = require("../../models/online");
const User = require("../../models/user");

const online = async (user) => {
    const newOnline = new Online({iduser: user.iduser, displayname: user.displayname});
    await newOnline.save();
    
}

const offline = (user) => {
    Online.deleteMany({iduser: user}, function(err, docs) {
        if(err) console.log(err) 
        else return;
    });
    return;
    Online.findOneAndDelete({iduser: user}, function(err, docs) {
        if(err) console.log(err) 
        else return;
    });
}

const listOnline = async () => {
    const listUser = await Online.find({});
    return listUser;
}

module.exports = {
    online,
    offline,
    listOnline
}