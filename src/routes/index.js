const router = require("express").Router();
const Annoucement = require("../models/annoucements");
const { ensureAuthenticated } = require("../config/auth");

// Get: Returns home page
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index.ejs", { user: req.user });
  } else {
    res.render("index.ejs");
  }
});

router.get("/rules",function(req,res){
  res.render("rules.ejs");
});

router.get("/announcement", async (req, res) => {
  try {
    const annoucements = await Annoucement.find({}).sort({ createdOn: -1 });
    if (req.isAuthenticated()) {
      res.render("announcement.ejs", { user: req.user, annoucements });
    } else {
      res.render("announcement.ejs", { annoucements });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
