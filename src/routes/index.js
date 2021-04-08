const router = require('express').Router();



// Get: Returns home page
router.get("/",async(req,res)=>{
    res.render("index.ejs");
});

module.exports=router;