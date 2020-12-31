const router = require('express').Router();

const MessageController = require('../../controller/message/index');

router.route('/:fromBoardId')
    .get(MessageController.getMessageFromBoardId)

router.route('/send-message')
    .post(MessageController.create)

module.exports = router;