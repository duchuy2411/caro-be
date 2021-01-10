const User = require('../../models/user');
const Online = require('../../models/online');

const JWT = require("jsonwebtoken");
const sessionStorage = require('node-sessionstorage');
const fs = require('fs');
//const nodemailer = require('nodemailer');
const elasticemail = require('elasticemail');

const UserService = require("../../service/UserService");
const ResApiService = require("../../service/ResApiService");

const encodedToken = (id) => {
    return JWT.sign({
        iss: '',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, 'webnangcao')
};

const index = async (req, res) => {
    try {
        const data = await UserService.getAll();
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, "", 200, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}


const login = async (req, res) => {

    const token = encodedToken(req.user._id);

    const user = await User.findById(req.user._id);

    if (user.block === 1) return res.status(403).json({
        error: 1,
        message: "Forbidden"
    })

    if (user) {
        res.setHeader('Authorization', "Bearer " + token);

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

        return res.cookie('currentUsername', user.username, { maxAge: 3600000 }).redirect('http://localhost:3000');
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
        let { displayname, username, password, email } = req.body;
        let existUser = await User.findOne({$or: [ { username: username }, {email: email}]});
        if (existUser)
            return ResApiService.ResApiSucces(null, 'Username or email already exists', 200, res);
        

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
            is_Delete: false,
            isActivated: false
        })

        await user.save();

        let usernew = await User.findOne({ username: username });
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
    let currentUser = await User.findOne({ username: req.params.username });

    if (currentUser) {
        return ResApiService.ResApiSucces({ user: currentUser }, 'Get current user success!', 200, res);
    }
    else {
        return ResApiService.ResApiNotFound(res);
    }
}

const getUserById = async (req, res, next) => {
    let user = await User.findOne({ _id: req.params.id });
    if (user) {
        return ResApiService.ResApiSucces({ user: user }, 'Get user success!', 200, res);
    }
    else {
        return ResApiService.ResApiNotFound(res);
    }
}

const logout = async (req, res) => {
    //const user = JSON.parse(sessionStorage.getItem('currentuser'));

    Online.findOneAndDelete({ iduser: req.params.iduser }, function (err, docs) {
        if (err) console.log(err)
        else return;
    });

    const onlineUserList = await Online.find({});
    return ResApiService.ResApiSucces({ userList: onlineUserList }, 'Get current online user list success!', 200, res);
}

const updateProfile = async (req, res) => {
    try {
        let { iduser, newPassword, newDisplayName, fileName } = req.body;
        let user = await User.findOne({ _id: iduser });
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

const client = elasticemail.createClient({
    username: 'hoangvinh175@gmail.com',
    apiKey: 'CF0729D3DBFF2289F17AE979BA32C4574CCE8D4F1FCFD3F8266724258D3B05E31048AE2E0A743D3460C75B175279B6C6'
    //password: '6EED0F04B242FA47CFFAE503D307C5B0055C'
})

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return ResApiService.ResApiSucces(null, "Email không tồn tại", 200, res);
        }

        const randomStr = makeid(100);
        const resetPasswordLink = "http://localhost:3000/reset-password/" + randomStr;
        sessionStorage.setItem(randomStr, email);

        const msg = {
            from: 'hoangvinh175@gmail.com',
            from_name: 'Caro Game',
            to: email,
            subject: 'Reset password Caro Game',
            body_text: 'Click vào link này để reset password: ' + resetPasswordLink
        };

        client.mailer.send(msg, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log(result);
            return ResApiService.ResApiSucces(null, "Đã gửi link reset password qua email " + email, 200, res);
        });

    } catch (error) {
        console.log(error);
    }

}

const resetPassword = async (req, res) => {
    try {
        const { key, password } = req.body;
        const email = sessionStorage.getItem(key);
        if (!email)
            return ResApiService.ResApiSucces(null, "Can't reset password", 200, res);
        sessionStorage.removeItem(key);
        const user = await User.findOne({ email: email });
        if (!user)
            return ResApiService.ResApiNotFound(res);

        user.password = password;
        user.save();
        return ResApiService.ResApiSucces(user, 'Reset password success!', 200, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const activateAccount = async (req, res) => {
    try {
        const email = req.body.email;

        const activatedUser = await User.findOne({ email: email, isActivated: true });
        if (activatedUser)
            return ResApiService.ResApiSucces(null, "Tài khoản này đã được xác minh", 200, res);

        const randomStr = makeid(100);
        const activateAccountLink = "http://localhost:3000/activate-account/" + randomStr;
        sessionStorage.setItem(randomStr, email);

        const msg = {
            from: 'hoangvinh175@gmail.com',
            from_name: 'Caro Game',
            to: email,
            subject: 'Activate account Caro Game',
            body_text: 'Click vào link này để xác thực tài khoản: ' + activateAccountLink
        };

        client.mailer.send(msg, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log(result);
            return ResApiService.ResApiSucces(null, "Đã gửi link xác thực tài khoản qua email " + email, 200, res);
        });

    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const checkActivateAccount = async (req, res) => {
    try {
        const { key } = req.body;

        const email = sessionStorage.getItem(key);
        console.log(email);
        console.log(key);
        if (!email)
            return ResApiService.ResApiSucces(null, "Can't activate account", 200, res);
        sessionStorage.removeItem(key);
        const user = await User.findOne({ email: email });
        if (!user)
            return ResApiService.ResApiNotFound(res);

        user.isActivated = true;
        user.save();
        return ResApiService.ResApiSucces(user, 'Activate account success!', 200, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



module.exports = {
    index,
    signup,
    login,
    testau,
    getCurrentUser,
    getUserById,
    logout,
    updateProfile,
    forgetPassword,
    resetPassword,
    activateAccount,
    checkActivateAccount
}