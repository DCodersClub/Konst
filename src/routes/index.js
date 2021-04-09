const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");

// Get: Returns home page
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index.ejs", { user: req.user});
  } else {
    res.render("index.ejs");
  }
});


module.exports = router;
