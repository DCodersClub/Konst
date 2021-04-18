const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/user");

let board = [];
updateLeaderboard();

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("leaderboard.ejs", { user: req.user, board });
  } else {
    res.render("leaderboard.ejs", { board });
  }
});

setInterval(updateLeaderboard, 10000);

function updateLeaderboard() {
  User.find({}, { name: 1, score: 1, time: 1 })
    .sort({ score: -1, time: 1 })
    .then((users) => {
      board = users;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = router;
