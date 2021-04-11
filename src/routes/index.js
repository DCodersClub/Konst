const router = require("express").Router();
const Annoucement=require("../models/annoucements");
const { ensureAuthenticated } = require("../config/auth");

// Get: Returns home page
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index.ejs", { user: req.user});
  } else {
    res.render("index.ejs");
  }
});


router.get("/annoucements", async (req,res)=>{
  try{
    const annoucements=await Annoucement.find({}).sort({createdOn: -1});
    res.render("announcement.ejs",{annoucements});
  }catch(err){
    console.log(err);
  }
});


module.exports = router;
