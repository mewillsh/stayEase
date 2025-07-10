const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn}=require("../middleware.js"); //Middelware for User Loggedin

//Joi validate as middleware (Listing)
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body,{abortEarly:false});
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};
//Index Route
router.get("/",wrapAsync (async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}));
// New Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new");
});
// Show Route
router.get("/:id", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("failure","Listing You requested Not Exist");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show",{listing});
}));
//Create Listing route
router.post("/",isLoggedIn,validateListing, wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing is Created");
    res.redirect("/listings");
}));
//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("failure","Listing You requested Not Exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit",{listing});
}));
// //Update Route
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Got Updated Successfully");
    res.redirect(`/listings/${id}`);
}));
// //Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Got Deleted Successfully");
    res.redirect("/listings");
}));

module.exports=router;