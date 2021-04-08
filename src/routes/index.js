const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");

// Get: Returns home page
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index.ejs", { user: req.user, page: 0 });
  } else {
    res.render("index.ejs", { page: 0 });
  }
});

router.get("/contest", ensureAuthenticated, async (req, res) => {
  res.render("contest.ejs", {
    name: req.user.name,
  });
});
module.exports = router;
