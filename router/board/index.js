const router = require('express').Router();

const BoardController = require('../../controller/board/index');

router.route('/')
        .get(BoardController.getAll)
        .post(BoardController.createBoard)
router.route('/join')
        .post(BoardController.joinBoard)
router.route('/leave')
        .post(BoardController.leaveBoard)

module.exports = router;