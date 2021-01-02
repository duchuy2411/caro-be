const User = require('../../models/user');
const Online = require('../../models/online');

const JWT = require("jsonwebtoken");
const sessionStorage = require('node-sessionstorage');
var fs = require('fs');

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
        //res.cookie('currentUsername', user.username, {maxAge: 3600000});

        //return ResApiService.ResApiSucces(user, "Sign in success", 200, res);
        
        return res.cookie('currentUsername', user.username, {maxAge: 3600000}).redirect('http://localhost:3000');
        // return res.redirect('http://localhost:3000/play').json({
        //     error: 0,
        //     message: 'Login  success!',
        //     data: {user: user}
        // });
    }
    else {
        //return ResApiService.ResApiNotFound(res);
        return res.redirect('http://localhost:3000/sign-in');
    }
}

const signup = async (req, res, next) => {
    try {
        let {displayname, username, password, email} = req.body;
        let existUser = await User.findOne({username: username});
        if (existUser)
            return ResApiService.ResApiSucces(null, 'Username already exists', 200, res);

        let user = new User({
            displayname: displayname,
            username: username,
            password: password,
            email: email,
            avatar: null,
            join_date: new Date(),
            cup: 0,
            total_match: 0,
            win_match: 0,
            win_percent: 0.0,
            block: false,
            is_Delete: false
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

const updateProfile = async (req, res) => {
    try {
        let {iduser, newPassword, newDisplayName, fileName} = req.body;
        let user = await User.findOne({_id: iduser});
        if (!user)
            return ResApiService.ResApiNotFound(res);
        if (newPassword)
            user.password = newPassword;
        user.displayname = newDisplayName;
        if (fileName) {
            user.avatar.data = fs.readFileSync(fileName);
            user.avatar.contentType = 'image/png';
        }
        user.save();
        return ResApiService.ResApiSucces(user, 'Update profile success!', 200, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }

}

module.exports = {
    index, 
    signup,
    login,
    testau,
    getCurrentUser,
    getUserById,
    logout,
    updateProfile
}