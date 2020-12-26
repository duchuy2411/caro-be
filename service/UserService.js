const User = require('../models/user');

class UserService {
    async getAll() {
        const result =  await User.find({});
        console.log(result);
        if (!result) return null;
        return result;
    }

    async updateMatch(id, updateData) {
        const data = await User.findOneAndUpdate({_id: id}, {updateData});
        if (!data) return null;

        return data;
    }

    async update(id, updateData) {
        const {displayname, username, email} = updateData;
        const new_regex = /^[a-zA-Z0-9\s]/
        if (displayname.length < 4 && displayname.length > 50) return null;
        if (displayname.match(new_regex)) return null;
    }
}

module.exports = new UserService();