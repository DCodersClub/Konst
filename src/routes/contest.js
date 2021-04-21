const User = require("../models/user");
const Question = require("../models/question");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { mongo } = require("mongoose");
const { ensureAuthenticated } = require("../config/auth");
const start = new Date("April 18, 2021 20:00:00 GMT+0530");
const end = new Date("May 19, 2021 00:00:00 GMT+0530");

router.get("/", ensureAuthenticated, async (req, res) => {
  if (getCurrentDiffMillis(start) <= 0) {
    res.send("Contest not running");
  }
  if (getCurrentDiffMillis(end) >= 0) {
    res.send("Contest has ended");
  } else {
    res.render("contest.ejs", {
      name: req.user.name,
    });
  }
});

router.get("/questions", ensureAuthenticated, async (req, res) => {
  User.findOne({ email: req.user.email }).then((user) => {
    if (
      typeof user.questions == null ||
      typeof user.questions == undefined ||
      user.questions.length == 0
    ) {
      Question.find({})
        .limit(10)
        .then((questions) => {
          User.findOne({ email: req.user.email }).then((user) => {
            user.questions = questions;
            user
              .save()
              .then(() => {
                res.send({ questions: questions, solved: user.solved });
              })
              .catch((err) => res.sendStatus(500));
          });
        })
        .catch((err) => {
          res.sendStatus(500);
        });
    } else {
      res.send({ questions: user.questions, solved: user.solved });
    }
  });
});

router.post("/success", function (req, res) {
  if (!req.user) {
    res.sendStatus(403);
  } else {
    if (getCurrentDiffMillis(end) >= 0) {
      res.sendStatus(423);
    } else {
      let { questionIndex } = req.body;
      questionIndex -= 1;
      const penalty = new Date() - start;

      User.findOne({ email: req.user.email })
        .then((user) => {
          if (!user.solved.includes(parseInt(questionIndex))) {
            user.solved.push(parseInt(questionIndex));
            if (user.score == null || typeof user.score == "undefined") {
              user.score = 100;
            } else {
              user.score += 100;
            }
            user.time = penalty;
          }

          user
            .save()
            .then(() => {
              res.sendStatus(200);
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    }
  }
});

module.exports = router;

function getCurrentDiffMillis(start) {
  const currentDate = new Date();
  let diff = currentDate - start;
  return diff;
}
