const router = require('express').Router();
const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

const MessageController = require('../../controller/message/index');

router.route('/boardid/:fromBoardId')
    .get(passport.authenticate('jwt', {session: false}), MessageController.getMessageFromBoardId)

router.route('/boardmatch/:fromBoardMatch')
    .get(passport.authenticate('jwt', {session: false}), MessageController.getMessageFromBoardMatch)

router.route('/send-message')
    .post(passport.authenticate('jwt', {session: false}), MessageController.create)

module.exports = router;