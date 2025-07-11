const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js"); //Middelware for User Loggedin
const listingController=require("../controllers/listings.js");

router.route("/")
//Index Route
.get(wrapAsync (listingController.index))
//Create Listing Route
.post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router.route("/:id")
//Show Route
.get( wrapAsync(listingController.showListings))
//Update Route
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;