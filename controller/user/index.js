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

        //xóa tk khách trong ds online sau khi đăng nhập
        // Online.findOneAndDelete({iduser: JSON.parse(sessionStorage.getItem('currentuser'))._id}, function(err, docs) {
        //     if(err) console.log(err) 
        //     else return;
        // });
        
        //thêm tài khoản đã đăng nhập
        //sessionStorage.setItem('currentuser', JSON.stringify(user));
        
        //req.session.currentUsername = tmpUser.username;
        
        //res.cookie('currentUsername', tmpUser.username, { maxAge: 900000, secure: false, httpOnly: false });
        
        //cookies.set('currentUsername', tmpUser.username);
        //res.cookie('cookie', 'monster', { path: '/', secure: true })
        //req.cookieSessionHome.currentUser = tmpUser;
        //req.session.save();
        //currentUser = user;
        
        return res.cookie('currentUsername', user.username, {maxAge: 3600000}).redirect('http://localhost:3000');
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
    try {
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

        return ResApiService.ResApiSucces(usernew, 'Create success!', 201, res);
    }
    catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const testau = async (req, res, next) => {
    return res.status(200).json({
        message: "ok"
    })
}

const getCurrentUser = async (req, res, next) => {
    let currentUser = await User.findOne({username: req.params.username});
    
    if (currentUser) {
        return ResApiService.ResApiSucces({user: currentUser}, 'Get current user success!', 200, res);
    }
    else {
        return ResApiService.ResApiNotFound(res);
    }
}

const getUserById = async (req, res, next) => {
    let user = await User.findOne({_id: req.params.id});
    if (user) {
        return ResApiService.ResApiSucces({user: user}, 'Get user success!', 200, res);
    }
    else {
        return ResApiService.ResApiNotFound(res);
    }
}

const logout = async (req, res) => {
    //const user = JSON.parse(sessionStorage.getItem('currentuser'));
    
    Online.findOneAndDelete({iduser: req.params.iduser}, function(err, docs) {
        if(err) console.log(err) 
        else return;
    });

    const onlineUserList = await Online.find({});
    return ResApiService.ResApiSucces({userList: onlineUserList}, 'Get current online user list success!', 200, res);
}

module.exports = {
    index, 
    signup,
    login,
    testau,
    getCurrentUser,
    getUserById,
    logout
}