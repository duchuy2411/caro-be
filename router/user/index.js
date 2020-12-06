const router = require("express").Router();

const UserController = require('../../controller/user/index')

router.route("/")
    .get(UserController.index)

module.exports = router;