const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { ExtractJwt } = require("passport-jwt");
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "webnangcao";

const User = require("../models/user");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('../key');

const axios = require("axios");

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(async function (id, done) {
    const user = await User.findOne({ username: id });
    return done(null, user);
});

// Passport Jwt
passport.use(
new JwtStrategy(
    {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
    secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) return done(null, false);

        done(null, user);
    } catch (error) {
        done(error, false);
    }
    }
)
);
// Passport local
passport.use(
    new LocalStrategy(
    {
    usernameField: "username",
    },
    async (username, password, done) => {
        try {
        const user = await User.findOne({ username });
    
        if (!user) return done(null, false);

        const isCorrectPassword = await user.isValidPassword(password);

        if (!isCorrectPassword) return done(null, false);

        done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
    )
)

passport.use('google', new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            const existUser = await User.findOne({username: profile.id});
            
            if (existUser) {
                return done(null, existUser);
            }
            else {
                let newUser = new User({
                    displayname: profile.name.familyName + " " + profile.name.givenName,
                    username: profile.id,
                    password: "",
                    email: profile.emails[0].value,
                    avatar: {
                        data: null,
                        contentType: profile.photos[0].value
                    },
                    join_date: new Date(),
                    cup: 0,
                    total_match: 0,
                    win_match: 0,
                    win_percent: 0.0,
                    block: false,
                    is_Delete: false
                });
                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            done(error, false);
        }
    }
));

passport.use('facebook', new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["displayName", "email"]
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            const existUser = await User.findOne({username: profile.id});
            if (existUser) {
                return done(null, existUser);
            }
            else {
                const app_access_token = await axios.post("https://graph.facebook.com/oauth/access_token?client_id=" + FACEBOOK_APP_ID + "&client_secret=" + FACEBOOK_APP_SECRET + "&grant_type=client_credentials").access_token;
                let newUser = new User({
                    displayname: profile.displayName,
                    username: profile.id,
                    password: "",
                    email: profile.emails[0].value,
                    //avatar: null,
                    avatar: {
                        data: null,
                        contentType: "https://graph.facebook.com/" + profile.id + "/picture?type=large&access_token=" + app_access_token
                    },
                    join_date: new Date(),
                    cup: 0,
                    total_match: 0,
                    win_match: 0,
                    win_percent: 0.0,
                    block: false,
                    is_Delete: false
                });
                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            done(error, false);
        }
    }
));

// passport.use('local.signin', new LocalStrategy({
//       passReqToCallback: true
//     }, function (req, username, password, done) {
//       try {
//         const user = User.findOne({ username });
//         console.log(username);
//         if (!user) return done(null, false);
        
//         const isCorrectPassword = User.isValidPassword(password);

//         if (!isCorrectPassword) return done(null, false);

//         done(null, user);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );
