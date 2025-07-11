const express=require("express");
const router=express();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

//Signup Route
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//Login Route
router.route("/login")
.get(wrapAsync(userController.renderLoginForm))
.post(saveRedirectUrl, passport.authenticate("local",
  { failureRedirect:"/login",
    failureFlash:true,
  }
),
  userController.login
);

//LogOut Route
router.get("/logout",userController.logout);

module.exports=router;