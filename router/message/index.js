const router = require('express').Router();

const MessageController = require('../../controller/message/index');

router.route('/boardid/:fromBoardId')
    .get(MessageController.getMessageFromBoardId)

router.route('/boardmatch/:fromBoardMatch')
    .get(MessageController.getMessageFromBoardMatch)

router.route('/send-message')
    .post(MessageController.create)

module.exports = router;