const router = require('express').Router();

const MatchController = require('../../controller/match/index');
const MailController = require('../../controller/MailController')

const passport = require('passport')
const passportConfig = require('../../middlewares/passport');

router.route('/')
    // .get(MatchController.get)
    .post(passport.authenticate('jwt', {session: false}), MatchController.create)

router.route('/iduser/:iduser')
    .get(passport.authenticate('jwt', {session: false}), MatchController.get_match)

router.route('/update')
    .post(passport.authenticate('jwt', {session: false}), MatchController.update)

router.route('/win')
    .post(passport.authenticate('jwt', {session: false}), MatchController.update_win)

router.route('/mail')
    .get(passport.authenticate('jwt', {session: false}), MailController.send)

router.route('/mail/trigger')
    .post(passport.authenticate('jwt', {session: false}), MailController.trigger)

router.route('/mail/confirm')
    .post(passport.authenticate('jwt', {session: false}), MailController.confirm)

module.exports = router;