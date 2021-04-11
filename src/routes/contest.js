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
    if (typeof user.questions == null || typeof user.questions == undefined || user.questions.length==0) {
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

router.post("/success",function(req,res){
  const {questionIndex} = req.body;
  User.findOne({email:req.user.email}).then((user)=>{
    var found = false;
    let i;
    for ( i = 0 ; i < 10 ; i++){
      if(user.questions[i].index == questionIndex){
        found = true;
        break;
      }
    }

    if(found){
      user.questions[i].solved = true;
      user.save().then(()=>{res.sendStatus(200)}).catch((err)=>{res.sendStatus(500)});
    }
    else{
      res.sendStatus(404);
    }
  }).catch((err)=>{
    console.log(err);
    res.sendStatus(500);
  });
});

module.exports = router;
