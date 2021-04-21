const User = require("../models/user");
const Token = require("../models/token");
const router = require("express").Router();
const mailer = require("../services/mailer");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const crypto = require("crypto");

router.get("/login", async (req, res) => {
  if (req.isAuthenticated()) res.redirect("/");
  else res.render("user/login.ejs");
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
  if (req.isAuthenticated()) res.redirect("/");
  else res.render("user/register.ejs");
});

router.post("/register", async (req, res) => {
  let errors = [];
  const {
    name,
    email,
    mobileNumber,
    password,
    password2,
    collegeName,
  } = req.body;
  if (!name || !email || !mobileNumber || !password || !collegeName) {
    errors.push({ msg: "Fields Cant be empty" });
  }
  if (password.length < 6 || password.length > 20) {
    errors.push({ msg: "Password should be between 6 to 20 characters" });
  }
  if (name.length > 30 || email.length > 50 || collegeName.length > 200) {
    errors.push({ msg: "APNI KABILIYAT KAHI AUR" });
  }
  if (password != password2) {
    errors.push({ msg: "Passwords does not match" });
  }

  try {
    let user = await User.findOne({ email: email });
    if (user && user.isVerified) {
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
      //Delete any past user with this email id
      await User.deleteMany({ email });

      const saltRounds = 10;
      const hashPass = await bcrypt.hash(password, saltRounds);
      let newUser = User({
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        password: hashPass,
        collegeName: collegeName,
      });
      newUser = await newUser.save();
      let token = new Token({
        _userId: newUser._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();
      let message =
        "Hello " +
        name +
        ",\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/user/confirmation/" +
        email +
        "/" +
        token.token +
        "\n\nThank You!\n";
      req.flash(
        "success_msg",
        "Registered Successfully, Check Your Mail To Verify Your Account. Didn't get the mail? Check your spam folder or click on resend."
      );
      mailer.sendMail(email, "Welcome to Konst", message);
      res.redirect("/user/confirm");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/profile", ensureAuthenticated, async (req, res) => {
  res.render("user/profile", { user: req.user });
});

router.post("/profile", ensureAuthenticated, async (req, res) => {
  let errors = [];
  let user = req.user;
  const { name, email, mobileNumber, collegeName } = req.body;

  if (email != req.user.email) {
    errors.push({ msg: "Email Cannot be Changed" });
    let user = req.user;
    res.render("user/profile.ejs", { user, errors });
    return;
  }

  if (name.length > 30 || email.length > 50 || collegeName.length > 200) {
    errors.push({ msg: "APNI KABILIYAT KAHI AUR" });
  }
  if (errors.length > 0) {
    res.render("user/profile.ejs", { errors, user });
  } else {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        errors.push({ msg: "User not found" });
      } else {
        user.name = name;
        user.collegeName = collegeName;
        user.mobileNumber = mobileNumber;
        const updatedUser = await user.save();
        res.render("user/profile.ejs", {
          confirm: { msg: "Profile Updated Successfully" },
          user: updatedUser,
        });
      }
      if (errors.length > 0) {
        res.render("user/profile.ejs", { errors, user });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
});

router.get("/profile/updatePassword", ensureAuthenticated, async (req, res) => {
  res.render("user/update_password.ejs");
});

router.post(
  "/profile/updatePassword",
  ensureAuthenticated,
  async (req, res) => {
    const { oldPassword, newPassword, newPassword2 } = req.body;
    let errors = [];
    if (newPassword.length < 6 && newPassword.length > 20) {
      errors.push({
        msg: "Password should be more between 6 and 20 characters",
      });
    }

    if (newPassword != newPassword2) {
      errors.push({ msg: "Passwords does not match" });
    }

    if (errors.length > 0) {
      res.render("user/update_password.ejs", { errors });
    } else {
      try {
        bcrypt.compare(oldPassword, req.user.password, async (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const saltRounds = 10;
            const hashPass = await bcrypt.hash(newPassword, saltRounds);
            let user = await User.findOne({ email: req.user.email });
            user.password = hashPass;
            const updatedUser = await user.save();
            res.render("user/update_password.ejs", {
              confirm: { msg: "Password Updated Successfully" },
              user: updatedUser,
            });
          } else {
            errors.push({ msg: "Incorrect Password" });
            res.render("user/update_password.ejs", { errors });
          }
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

router.get("/confirmation/:email/:token", async (req, res) => {
  try {
    let token = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.render("user/confirm", {
        error:
          "Your verification link may have expired. Please click on resend to verify your Email.",
      });
    } else {
      let user = await User.findOne({
        _id: token._userId,
        email: req.params.email,
      });
      if (!user) {
        return res.render("user/confirm", {
          error:
            "We were unable to find a user for this verification code. Please sign up!",
        });
      } else if (user.isVerified) {
        return res.render("user/confirm", {
          error: "User has been already verified. Please Login",
        });
      } else {
        user.isVerified = true;
        await user.save();
        let message =
          "Hello " +
          user.name +
          ",\n" +
          "Your account has been created successfully, and you are all set to participate in KONST-April 2021\n" +
          "\n" +
          "Do not forget to join our WhatsApp group for live updates regarding the contest.\n" +
          "\n" +
          "https://chat.whatsapp.com/GSNgA50uW3A1SE1CQpBwif\n" +
          "\n" +
          "Meanwhile, you should check out the rules(http://34.66.129.119/rules)  and about(http://34.66.129.119/about) section to know more about the event.\n" +
          "\n" +
          "Reach out to us at null.konst@gmail.com for any kind of queries.\n" +
          "\n" +
          "Regards \n" +
          "Konst\n" +
          "Team D'coders";
        mailer.sendMail(user.email, "Konst", message);
        req.flash("success_msg", "Account Verified. Login!");
        res.redirect("/user/login");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/confirm", async (req, res) => {
  res.render("user/confirm.ejs");
});

router.post("/resendLink", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      res.render("user/confirm.ejs", {
        error:
          "We were unable to find a user with that email. Make sure your Email is correct!",
      });
    } else if (user.isVerified) {
      res.render("user/confirm.ejs", {
        confirm: {
          msg: "This account has been already verified. Please log in.",
        },
      });
    } else {
      await Token.deleteMany({ _userId: user._id });
      let token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();
      let message =
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/user/confirmation/" +
        email +
        "/" +
        token.token +
        "\n\nThank You!\n";
      mailer.sendMail(email, "Konst Verification Link", message);
      res.render("user/confirm.ejs", {
        confirm: { msg: "New Verification Link sent successfully" },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      let randomPassword = crypto.randomBytes(8).toString("hex");
      let email_text = `Your password has been reset to ${randomPassword}, For Security reasons we recommend changing the password as soon as you login `;
      mailer.sendMail(req.body.email, "Password Reset", email_text);
      const saltRounds = 10;
      const newHashedPass = bcrypt.hashSync(randomPassword, saltRounds);
      user.password = newHashedPass;
      await user.save();
    }
    res.render("user/forgot_password.ejs", {
      confirm: { msg: "Check Your Mail For New Password" },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/forgot", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("user/forgot_password.ejs", { user: req.user });
  } else {
    res.render("user/forgot_password.ejs");
  }
});

module.exports = router;
