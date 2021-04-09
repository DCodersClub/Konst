const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");


router.get("/",function(req,res){
    res.redirect("/admin/login");
});

router.get("/login", async (req, res) => {
  res.render("admin/login.ejs");
});

router.post("/login", async (req, res, next) => {
  let {username,password} = req.body;
  if(username="admin" && password=="password"){
      res.send("logged in");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged Out succesfully");
  res.redirect("/user/login");
});

router.get("/all", async (req, res) => {
  users = await User.find({});
  res.json(users);
});

module.exports = router;
