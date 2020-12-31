const Online = require('../models/online');

class OnlineService {
    async online(user) {
        const newOnline = new Online({iduser: user.iduser, displayname: user.displayname});
        await newOnline.save();
    }
    async offline(user) {
        Online.findOneAndDelete({iduser: user}, function(err, docs) {
            if(err) console.log(err) 
            else return;
        });
    }
    async listOnline() {
        const listUser = await Online.find({});
        return listUser;
    }
}

module.exports = new OnlineService();