const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
  res.render("users/signup")
};

module.exports.signup=async(req,res)=>{
  try{
    const{username,email,password}=req.body;
    let newUser=new User({
      email:email,
      username:username,
    });
    let newRigistration=await User.register(newUser,password);
    req.login(newRigistration,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Welcome to the StayNest");
      return res.redirect("/listings");
    })
  }
  catch(err){
    console.log(err);
    req.flash("success","Welcome To The StayNest");
    return res.redirect("/signup");
  }
};

module.exports.rederLoginForm=async(req,res)=>{
  res.render("users/login");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You Successfully LoggedOut");
    res.redirect("/listings");
  });
};