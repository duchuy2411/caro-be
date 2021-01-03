const Online = require('../models/online');
const User = require('../models/user');

class OnlineService {
    async online(user) {
        const currentUser = await User.findOne({_id: user.iduser});
        const newOnline = new Online({iduser: user.iduser, displayname: user.displayname, avatar: currentUser.avatar});
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