const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const { ExtractJwt } = require("passport-jwt");
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "webnangcao";

const User = require("../models/user");

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
);

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