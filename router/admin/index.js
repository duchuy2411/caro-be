const router = require("express").Router();
const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

const AdminController = require('../../controller/admin/index')
router.route("/users")
    .get(AdminController.getUsers)

router.route('/auth')
    .post(AdminController.login)

router.route('/register')
    .post(AdminController.register)

router.route('/users/:id')
    .get(AdminController.getUser)

module.exports = router;