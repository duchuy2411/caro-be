const router = require("express").Router();
const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

const UserController = require('../../controller/user/index')
const sessionStorage = require('node-sessionstorage');
router.route("/")
    .get(UserController.getCurrentUser)
    .post(UserController.signup)
router.route("/login")
    .get(UserController.getCurrentUser)
    .post(passport.authenticate('local', {session: false}), UserController.login)

router.route("/logout/:iduser")
    .get(UserController.logout)

// router.route("/login")
//     .get(UserController.testau)

//     .post(passport.authenticate('local', {session: false}), UserController.login)

//router.get('/login', UserController.login);

// router.post('/login', function (req, res, next) {
//     passport.authenticate('local.signin', function (err, user, info) {
//         console.log("3" + user);
//         if (err) { return next(err); }
//         if (!user) {
//             return res.redirect(domainName + '/sign-in');
//         }
//         sessionStorage.setItem('currentid', user._id);
//         sessionStorage.setItem('currentusername', user.username);

//         req.logIn(user, function (err) {
//             if (err) { return next(err); }
//             return res.redirect(domainName + '/play');
//         });
//     })(req, res, next);
// })

module.exports = router;