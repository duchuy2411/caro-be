const router = require("express").Router();
const passport = require("passport");
const User = require("../../../models/user");

const JWT = require("jsonwebtoken");
const encodedToken = (id) => {
    return JWT.sign({
        iss: '',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET ? process.env.JWT : 'webnangcao')
};

router.route('/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/google/callback')
    .get(passport.authenticate('google', { failureRedirect: 'http://localhost:3000' + '/sign-in' })
        , function(req, res) {
            const token = encodedToken(req.user._id);
            res.setHeader('Authorization', token);
            return res.cookie('currentUsername', req.user.username, {maxAge: 3600000}).redirect('http://localhost:3000');
        })

router.route('/facebook')
    .get(passport.authenticate('facebook', { scope: 'email' }))

router.route('/facebook/callback')
    .get(passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000' + '/sign-in' })
        , function(req, res) {
            const token = encodedToken(req.user._id);
            res.setHeader('Authorization', token);
            return res.cookie('currentUsername', req.user.username, {maxAge: 3600000}).redirect('http://localhost:3000');
        })
module.exports = router;