const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/user");

let board = [];
updateLeaderboard();

router.get("/", function (req, res) {
<<<<<<< HEAD
  if (req.isAuthenticated()) {
    res.render("leaderboard.ejs", { user: req.user, board });
  } else {
    res.render("leaderboard.ejs", { board });
  }
=======
	res.render("leaderboard.ejs", { board });
>>>>>>> 78a104c24f269df104ab6e91e4b72bb062a0ad7a
});

setInterval(updateLeaderboard, 10000);

function updateLeaderboard() {
	User.find({}, { name: 1, score: 1, time: 1 })
		.sort({ score: -1,time:1 })
		.then((users) => {
			board = users;
		})
    .catch((err)=>{
      console.log(err);
    })
}

// function updateLeaderboard() {
// 	User.find({})
// 		.then((users) => {
// 			board = [];

// 			users.forEach((user) => {
// 				board.push({
// 					name: user.name,
// 					score: user.score,
// 					time: user.time,
// 				});
// 			});

// 			board.sort(function (b, a) {
// 				return a.score - b.score || b.time - a.time;
// 			});
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// }


module.exports = router;
