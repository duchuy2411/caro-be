const User = require('../../models/user');
const Online = require('../../models/online');

const JWT = require("jsonwebtoken");
const { Model } = require('mongoose');
const sessionStorage = require('node-sessionstorage');

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

let currentUser = null;

const login = async (req, res) => {

    const token = encodedToken(req.user._id);

    const user = await User.findById(req.user._id);
    
    if (user) {
        res.setHeader('Authorization', token);

        //xóa tk khách trong ds online sau khi đăng nhập
        // Online.findOneAndDelete({iduser: JSON.parse(sessionStorage.getItem('currentuser'))._id}, function(err, docs) {
        //     if(err) console.log(err) 
        //     else return;
        // });
        
        //thêm tài khoản đã đăng nhập
        //sessionStorage.setItem('currentuser', JSON.stringify(user));
        currentUser = user;

        return res.redirect('http://localhost:3000/play');
        // return res.redirect('http://localhost:3000/play').json({
        //     error: 0,
        //     message: 'Login  success!',
        //     data: {user: user}
        // });
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

    // return res.status(200).json({
    //     error: 0,
    //     message: 'Create success',
    //     data: {
    //         user: usernew
    //     }
    // })
}

const testau = async (req, res, next) => {
    return res.status(200).json({
        message: "ok"
    })
}

// const getCurrentUser = async (req, res, next) => {
//     let currentUserString = sessionStorage.getItem('currentuser');
//     if (currentUserString) {
//         const currentUserObject = JSON.parse(currentUserString);
//         return res.json({
//             error: 0,
//             message: 'Get current user success! ',
//             data: {user: currentUserObject}
//         });
//     }
//     else {
//         return res.json({
//             error: 0,
//             message: 'Not exist current user',
//             data: {user: null}
//         });
//     }
// }

const getCurrentUser = async (req, res, next) => {
    if (currentUser) {
        return res.json({
            error: 0,
            message: 'Get current user success! ',
            data: {user: currentUser}
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
    //const user = JSON.parse(sessionStorage.getItem('currentuser'));
    Online.findOneAndDelete({iduser: currentUser._id}, function(err, docs) {
        if(err) console.log(err) 
        else return;
    });
    //sessionStorage.setItem('currentuser', '');
    currentUser = null;

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