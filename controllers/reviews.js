const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    console.log(req.body)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Got Created Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Got Deleted Successfully");
    res.redirect(`/listings/${id}`);
}