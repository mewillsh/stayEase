module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash("failure","You Must LOGIN first");
    return res.redirect("/login");
  }
  next();
}