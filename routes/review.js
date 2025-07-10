const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validateReview}=require("../middleware.js");

//Review Post Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    console.log(req.body)
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Got Created Successfully");
    res.redirect(`/listings/${id}`);
}));
//Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Got Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;