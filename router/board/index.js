const router = require('express').Router();

const BoardController = require('../../controller/board/index');
const MatchController = require('../../controller/match/index');
const ControllerTextSocket = require('../../controller/ControllerTextSocket');

router.route('/')
    .get(BoardController.getAll)
    .post(BoardController.createBoard)
router.route('/quickplay')
    .get(ControllerTextSocket.getDelete)
    .post(ControllerTextSocket.createQuickPlay)
router.route('/deleteQuickPlay')
    .post(ControllerTextSocket.deleteQuickPlay)
router.route('/join')
    .post(BoardController.joinBoard)
router.route('/leave')
    .post(BoardController.leaveBoard)
router.route('/:id')
    .get(BoardController.getBoardByCode)
router.route('/iduser1/:iduser1')
    .get(BoardController.getBoardByIdUser1)
router.route('/addhistory/:id')
    .post(BoardController.addHistory)
router.route('/gethistory/:id')
    .get(BoardController.getHistoryList)
router.route('/:id/match/:match_id')
    .post(MatchController.create)
    .put(MatchController.update)
router.route(':id/match/:match_id/winner')
    .post(MatchController.update_win)



module.exports = router;