const express=require("express");
const router=express();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

//Signup Route
router.get("/signup",userController.renderSignupForm);
router.post("/signup",wrapAsync(userController.signup));

//Login Route
router.get("/login",wrapAsync(userController.rederLoginForm));
router.post("/login",saveRedirectUrl, passport.authenticate("local",
  { failureRedirect:"/login",
    failureFlash:true,
  }
),
  userController.login
);

//LogOut Route
router.get("/logout",userController.logout);

module.exports=router;