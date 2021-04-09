const User = require("../models/user");
const Question = require("../models/question");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { mongo } = require("mongoose");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("contest.ejs", {
    name: req.user.name,
  });
});

router.get("/questions", ensureAuthenticated, async (req, res) => {
  User.findOne({ email: req.user.email }).then((user) => {
    if (typeof user.questions == null || typeof user.questions == undefined) {
      //pass
      console.log("new questions generated");
      Question.find({})
        .limit(10)
        .then((questions) => {
          User.findOne({ email: req.user.email }).then((user) => {
            user.questions = questions;
            user
              .save()
              .then(() => {
                res.send(questions);
              })
              .catch((err) => res.sendStatus(500));
          });
        })
        .catch((err) => {
          res.sendStatus(500);
        });
    } else {
      res.send(user.questions);
      console.log("sent presaved questions");
    }
  });
});

module.exports = router;
