const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewsSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

//Joi validate as middleware (Review)
const validateReview=(req,res,next)=>{
    if (!req.body || !req.body.review) {
        return next(new ExpressError(400, "Review data is missing"));
    }
    let {error}=reviewsSchema.validate(req.body,{abortEarly:false});
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
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