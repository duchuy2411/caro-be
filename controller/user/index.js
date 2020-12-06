const User = require('../../models/user');
const JWT = require("jsonwebtoken")

const encodedToken = (username) => {
    return JWT.sign({
        iss: '',
        sub: username,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET)
};

const index = (req, res) => {
    res.status(200).json({
        error: 0,
        message: "OK",
        data : null
    })
}

const login = async (req, res) => {
    const token = encodedToken(req.user.id);

    const user = await User.findById(user.req.id);

    res.setHeader('Authorization', token);

    return res.status(201).json({
        error: 0,
        message: 'Login  success!',
        data: {

        }
    })
}

module.exports = {
    index
}