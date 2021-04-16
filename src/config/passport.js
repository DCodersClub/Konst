const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = async (passport) => {
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
