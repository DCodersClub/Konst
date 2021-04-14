const express = require("express");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("../config/passport")(passport);

module.exports = async (app) => {
  const http = require("http").createServer(app);
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  //setting express session
  app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
  });

  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "ejs");
  return app;
};
