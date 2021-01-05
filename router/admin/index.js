const router = require("express").Router();
const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

const AdminController = require('../../controller/admin/index')
router.route('/auth')
    .post(AdminController.login)

router.route('/register')
    .post(AdminController.register)

router.route("/users")
    .get(AdminController.getUsers)

router.route('/users/:id')
    .get(AdminController.getUser)

router.route('/users/:id/block')
    .post(AdminController.blockUser)

router.route("/matches")
    .get(AdminController.getMatches)

router.route("/matches/:id")
    .get(AdminController.getMatch)


module.exports = router;