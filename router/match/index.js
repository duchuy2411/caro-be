const router = require('express').Router();

const MatchController = require('../../controller/match/index');
const MailController = require('../../controller/MailController')

router.route('/')
    // .get(MatchController.get)
    .post(MatchController.create)

router.route('/update')
    .post(MatchController.update)

router.route('/win')
    .post(MatchController.update_win)

router.route('/mail')
    .get(MailController.send)

router.route('/mail/trigger')
    .post(MailController.trigger)

router.route('/mail/confirm')
    .post(MailController.confirm)

module.exports = router;