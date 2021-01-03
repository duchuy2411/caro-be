const router = require('express').Router();

const MatchController = require('../../controller/match/index');

router.route('/')
    // .get(MatchController.get)
    .post(MatchController.create)

router.route('/update')
    .post(MatchController.update)

router.route('/win')
    .post(MatchController.update_win)

module.exports = router;