const User = require('../models/user');
const router = require('express').Router();
const bcrypt=require('bcryptjs');

router.get("/login",async(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",async(req,res)=>{
    console.log("Login Post handle");
});

router.get("/register",async(req,res)=>{
    res.render("user/register.ejs");
});

router.post("/register",async(req,res)=>{
    let errors=[];
    const{name, email, mobileNumber, password,collegeName}=req.body;
    console.log(req.body);

    //Check if user already exist with this email
    //Validations will go here.

    const saltRounds = 10;
	const hashPass = await bcrypt.hash(password,saltRounds);
    let newUser=User({
        name:name,
        email:email,
        mobileNumber:mobileNumber,
        password: hashPass,
        collegeName: collegeName,
    })
    try{
        const user=await newUser.save();
        res.redirect("/user/login");
    }
    catch(e){
        console.log(e);
    }
});




router.get("/all",async(req,res)=>{
    users=await User.find({});
    res.json(users);
});

module.exports=router;