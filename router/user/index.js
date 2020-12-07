const router = require("express").Router();
const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

const UserController = require('../../controller/user/index')

router.route("/")
    .get(UserController.index)
    .post(UserController.signup)

router.route("/login")
    .post(passport.authenticate('local', {session: false}), UserController.login)

module.exports = router;