const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = async (passport) => {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
