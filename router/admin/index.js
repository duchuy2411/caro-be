const router = require("express").Router();
const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

const AdminController = require('../../controller/admin/index')
router.route("/users")
    .get(AdminController.getUsers)

router.route('/auth')
    .post(AdminController.login)


module.exports = router;