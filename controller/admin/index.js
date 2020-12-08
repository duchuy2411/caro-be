const User = require('../../models/user');
const Online = require('../../models/online');


const getUsers = async (req, res) => {
    const users = await User.find({});
    const response = users.map((el, index) => {
        return {...el.toObject(), id: index};
    })
    // console.log(response);
    return res.status(200).json(response);
}


module.exports = {
    getUsers
}