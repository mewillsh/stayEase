const express=require("express");
const router=express();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
router.get("/signup",(req,res)=>{
  res.render("users/signup")
});
router.post("/signup",wrapAsync( async(req,res)=>{
  try{
    const{username,email,password}=req.body;
    let newUser=new User({
      email:email,
      username:username,
    });
    let newRigistration=await User.register(newUser,password);
    req.flash("success","Welcome to StayNest");
    res.redirect("/listings");
    console.log(newRigistration);
  }
  catch(err){
    console.log(err);
    req.flash("success","Welcome To The StayNest");
    return res.redirect("/signup");
  }
}));

//Login Route
router.get("/login",wrapAsync(async(req,res)=>{
  res.render("users/login");
}));
router.post("/login",passport.authenticate("local",
  { failureRedirect:"/login",
    failureFlash:true,
  }
),
  async(req,res)=>{
    req.flash("success","Welcome Back");
    res.redirect("/listings");
  }
)

//LogOut Route
router.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You Successfully LoggedOut");
    res.redirect("/listings");
  });
})

module.exports=router;