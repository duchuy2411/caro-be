const User = require('../../models/user');
const Online = require('../../models/online');

const JWT = require("jsonwebtoken");
const { Model } = require('mongoose');

const encodedToken = (id) => {
    return JWT.sign({
        iss: '',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET ? process.env.JWT : 'webnangcao')
};

const index = async (req, res) => {
    return res.status(200).json({
        error: 0,
        message: "OK",
        data : await User.find({})
    })
}

const login = async (req, res) => {

    const token = encodedToken(req.user._id);

    const user = await User.findById(req.user._id);

    res.setHeader('Authorization', token);

    return res.status(201).json({
        error: 0,
        message: 'Login  success!',
        data: {user: user}
    })
}

const signup = async (req, res, next) => {
    let {displayname, username, password, email} = req.body;

    let user = new User({
        displayname: displayname,
        username: username,
        password: password,
        email: email
    })

    await user.save();

    let usernew = await User.findOne({username: username});
    console.log(usernew);

    return res.status(200).json({
        error: 0,
        message: 'Create success',
        data: {
            user: usernew
        }
    })
}

const testau = async (req, res, next) => {
    return res.status(200).json({
        message: "ok"
    })
}

module.exports = {
    index, 
    signup,
    login,
    testau
}