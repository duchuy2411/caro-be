
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')

const User = require('../models/user')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) return done(null, false)

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

// Passport local
passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    try {
        //console.log(username, password);
        const user = await User.findUser(username);

        if (!user) return done(null, false)

        // const isCorrectPassword = await User.verifyPassword(password, user.password)

        if (!isCorrectPassword)  {
            console.log("Sai");
            return done(null, false);
        }

        return done(null, user)
    } catch (error) {
        console.log(error);
        return done(error, false)
    }
}))
