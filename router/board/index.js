const router = require('express').Router();

const BoardController = require('../../controller/board/index');
const ControllerTextSocket = require('../../controller/ControllerTextSocket');

const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

router.route('/')
    .get(passport.authenticate('jwt', {session: false}), BoardController.getAll)
    .post(passport.authenticate('jwt', {session: false}), BoardController.createBoard)

router.route('/quickplay')
    .get(passport.authenticate('jwt', {session: false}), ControllerTextSocket.getDelete)
    .post(passport.authenticate('jwt', {session: false}), ControllerTextSocket.createQuickPlay)

router.route('/deleteQuickPlay')
    .post(passport.authenticate('jwt', {session: false}), ControllerTextSocket.deleteQuickPlay)

router.route('/join')
    .post(passport.authenticate('jwt', {session: false}), BoardController.joinBoard)

router.route('/leave')
    .post(passport.authenticate('jwt', {session: false}), BoardController.leaveBoard)

router.route('/:id')
    .get(passport.authenticate('jwt', {session: false}), BoardController.getBoardByCode)

router.route('/iduser1/:iduser1')
    .get(passport.authenticate('jwt', {session: false}), BoardController.getBoardByIdUser1)

router.route('/addhistory/:id')
    .post(passport.authenticate('jwt', {session: false}), BoardController.addHistory)

router.route('/gethistory/:id')
    .get(passport.authenticate('jwt', {session: false}), BoardController.getHistoryList)

// router.route('/match')
//     .post(MatchController.create)
//     .put(MatchController.update)
// router.route('/match/winner')
//     .post(MatchController.update_win)



module.exports = router;