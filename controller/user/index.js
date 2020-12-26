const User = require('../../models/user');
const Online = require('../../models/online');

const JWT = require("jsonwebtoken");
const sessionStorage = require('node-sessionstorage');

const UserService = require("../../service/UserService");
const ResApiService = require("../../service/ResApiService");

const encodedToken = (id) => {
    return JWT.sign({
        iss: '',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET ? process.env.JWT : 'webnangcao')
};

const index = async (req, res) => {
    try {
        const data = await UserService.getAll();
        if (!data) return ResApiService.ResApiNotFound(res);
        
        return ResApiService.ResApiSucces(data, "", 200, res);
    } catch(error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const login = async (req, res) => {

    const token = encodedToken(req.user._id);

    const user = await User.findById(req.user._id);
    
    if (user) {
        res.setHeader('Authorization', token);
        sessionStorage.setItem('currentuser', JSON.stringify(user));
        const newOnline = new Online({iduser: user._id, displayname: user.displayname});
        await newOnline.save();

        return res.redirect('http://localhost:3000/play');
    }
    else {
        return res.redirect('http://localhost:3000/sign-in');
    }
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

    return res.redirect('http://localhost:3000/sign-in');
}

const testau = async (req, res, next) => {
    return res.status(200).json({
        message: "ok"
    })
}

const getCurrentUser = async (req, res, next) => {
    let currentUserString = sessionStorage.getItem('currentuser');
    if (currentUserString) {
        const currentUserObject = JSON.parse(currentUserString);
        return res.json({
            error: 0,
            message: 'Get current user success! ',
            data: {user: currentUserObject}
        });
    }
    else {
        return res.json({
            error: 0,
            message: 'Not exist current user',
            data: {user: null}
        });
    }
}

const logout = async (req, res) => {
    const user = JSON.parse(sessionStorage.getItem('currentuser'));
    Online.findOneAndDelete({iduser: user._id}, function(err, docs) {
        if(err) console.log(err) 
        else return;
    });
    sessionStorage.setItem('currentuser', '');

    const onlineUserList = await Online.find({});
    return res.json({
        error: 0,
        message: 'Get current online user list success! ',
        data: {userList: onlineUserList}
    });
}

module.exports = {
    index, 
    signup,
    login,
    testau,
    getCurrentUser,
    logout
}