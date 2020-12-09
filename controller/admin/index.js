const User = require('../../models/user');
const Online = require('../../models/online');
const Admin = require('../../models/admin');
const JWT = require("jsonwebtoken");

const encodedToken = (id) => {
    return JWT.sign({
        iss: '',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET ? process.env.JWT : 'webnangcao')
};

const login = async (req, res) => {
    console.log(req.body);
    const admin = await Admin.findOne({username: req.body.username});
    // 5fd0a9bc941a53579060a13e
    if (admin && admin.isValidPassword(req.body.password)) {
        const token = encodedToken(admin._id);

        return res.status(201).json({
            error: 0,
            message: 'Login  success!',
            token
        })
    } else {
        return res.status(401).json({
            error: 'login failed'
        })
    }
}

const register = async (req, res) => {
    const admin = new Admin(req.body);
    const result = await admin.save();
    return res.send(result);
}

const getUsers = async (req, res) => {
    const users = await User.find({});
    const response = users.map((el, index) => {
        return {...el.toObject(), id: index};
    })
    // console.log(response);
    return res.status(200).json(response);
}


module.exports = {
    getUsers,
    login,
    register
}