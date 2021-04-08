const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

router.get("/login", async (req, res) => {
  res.render("user/login.ejs");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user == null) {
        res.send("you aint gettin in homie");
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          res.send("logged in");
        } else {
          res.send("still not getting in");
        }
      }
    })
    .catch((err) => {
      res.send("server's fucked up mate");
    });
});

router.get("/register", async (req, res) => {
  res.render("user/register.ejs");
});

router.post("/register", async (req, res) => {
  let errors = [];
  const { name, email, mobileNumber, password, collegeName } = req.body;
  console.log(req.body);

  //Check if user already exist with this email
  //Validations will go here.

  const saltRounds = 10;
  const hashPass = await bcrypt.hash(password, saltRounds);

  let newUser = User({
    name: name,
    email: email,
    mobileNumber: mobileNumber,
    password: hashPass,
    collegeName: collegeName,
  });
  try {
    newUser
      .save()
      .then(() => {
        res.redirect("/user/login");
      })
      .catch((err) => {
        res.send("shit");
      });
  } catch (e) {
    console.log(e);
  }
});

router.get("/all", async (req, res) => {
  users = await User.find({});
  res.json(users);
});

module.exports = router;
