const router = require('express').Router();

const MessageController = require('../../controller/message/index');

router.route('/:fromBoardId')
    .get(MessageController.getMessageFromBoardId)

module.exports = router;