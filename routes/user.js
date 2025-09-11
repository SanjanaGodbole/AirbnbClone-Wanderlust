const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");


/////Signup Functionality   //////////////////
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
    //Failed to lookup view "signup.ejs" in views directory "D:\Sanjana\Development\Web Development\Apna College\Major Project-AirBnb\views"
    //Path till views is set, inside that you have to guide
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
         let {username,email,password}=req.body;
    const newUser=new User({email,username});
     const registeredUser=await User.register(newUser,password);
     req.flash("success","Welcome to wanderlust");
     res.redirect("/listings");
    }catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   
}))


////////Login Functionality////////////////


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>
{
req.flash("success","Welcome to Wanderlust");
res.redirect("/listings")
})
module.exports=router