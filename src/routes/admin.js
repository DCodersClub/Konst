const User = require("../models/user");
const Annoucement=require("../models/annoucements");
const Question = require("../models/question");
const router = require("express").Router();
const mailer = require("../services/mailer");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { mongo } = require("mongoose");

router.get("/", function (req, res) {
  if (req.cookies.authed == "true") {
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/dashboard", function (req, res) {
  if (req.cookies.authed != "true") {
    res.redirect("admin/login");
  } else {
    var query1 = User.find({});
    var query2 = Question.find({});

    Promise.all([query1, query2]).then((results) => {
      res.render("admin/dashboard", {
        users: results[0],
        questions: results[1],
      });
    });
  }
});

router.get("/login", async (req, res) => {
  res.render("admin/login.ejs");
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  if ((username = "admin" && password == "thisisaweakpassword")) {
    res.cookie("authed", "true");
    res.redirect("/admin/dashboard");
  }
});

router.post("/question/add", function (req, res) {
  if (req.cookies.authed != "true") {
    res.sendStatus(403);
  }
  else{
  var { index, question, answer } = req.body;

  var newQuestion = Question({
    index,
    question,
    answer,
  });

  newQuestion
    .save()
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((err) => {
      res.send(err);
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("authed");
  req.flash("success_msg", "Logged Out succesfully");
  res.redirect("/admin/login");
});

router.get("/all", async (req, res) => {
  users = await User.find({});
  res.json(users);
});


router.post("/announce",async (req,res)=>{
  if (req.cookies.authed != "true") {
    res.sendStatus(403);
  }
  else{
  try{
    const {subject,message}=req.body;
    const newAnnouce=Annoucement({
      subject:subject,
      content:message,
    })
    await newAnnouce.save();
    let users=await User.find({});
    mailList=[]
    for(user of users){
      mailList.push(user.email);
    }
    mailer.sendMultiple(mailList, subject,message);
    res.redirect("/admin")
  }catch(err){
    console.log(err);
  }}
});

module.exports = router;
