const express=require("express");
const router=express.Router();

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
    //Failed to lookup view "signup.ejs" in views directory "D:\Sanjana\Development\Web Development\Apna College\Major Project-AirBnb\views"
    //Path till views is set, inside that you have to guide
})


module.exports=router