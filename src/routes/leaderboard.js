const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/",function(req,res){
    res.render("leaderboard.ejs");
});


module.exports = router;
