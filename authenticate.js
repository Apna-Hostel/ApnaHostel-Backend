var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");

var User = require("./models/users");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 7 * 24 * 3600 });
};

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.jwtPassport = passport.use(
  new LocalStrategy(opts, (jwt_payload, done) => {    // changed JwtStrategy to LocalStrategy
    console.log("JWT payload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) return done(err, false);
      else if (user) {
        return done(null, user);
      } else return done(null, false);
    });
  })
);

exports.verifyAdmin = function (req, res, next) {
  if (req.user.admin) {
    next();
  } else {
    const err = new Error("You are not authorized to perform this operation");
    err.status = 403;
    return next(err);
  }
};
