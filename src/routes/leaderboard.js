const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/user");

let board = [];
updateLeaderboard();
setInterval(updateLeaderboard, 30000);

router.get("/", function (req, res) {
  if (req.user) {
    let rank = 0;
    let found = false;
    board.forEach((entry) => {
      if (!found) rank += 1;
      if (entry.id == req.user.id) found = true;
    });
    res.render("leaderboard.ejs", { user: req.user, board, rank: rank });
  } else {
    res.render("leaderboard.ejs", { board });
  }
});

function updateLeaderboard() {
  User.find({ isVerified: true })
    .sort({ score: -1, time: 1 })
    .then((users) => {
      board = users;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = router;
