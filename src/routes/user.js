const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", async (req, res) => {
  res.render("user/login.ejs");
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged Out succesfully");
  res.redirect("/user/login");
});

router.get("/register", async (req, res) => {
  res.render("user/register.ejs");
});

router.post("/register", async (req, res) => {
  let errors = [];
  const { name, email, mobileNumber, password, collegeName } = req.body;
  if (!name || !email || !mobileNumber || !password || !collegeName) {
    errors.push({ msg: "Fields Cant be empty" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password should be more than 6 characters" });
  }

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      errors.push({ msg: "Email already in use" });
    }
    if (errors.length > 0) {
      res.render("user/register", {
        errors,
        name,
        email,
        mobileNumber,
        collegeName,
      });
    } else {
      const saltRounds = 10;
      const hashPass = await bcrypt.hash(password, saltRounds);
      let newUser = User({
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        password: hashPass,
        collegeName: collegeName,
      });
      await newUser.save();
      req.flash("success_msg", "Registered Successfully");
      res.redirect("/user/login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/all", async (req, res) => {
  users = await User.find({});
  res.json(users);
});

module.exports = router;
