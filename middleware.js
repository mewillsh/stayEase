const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewsSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("failure","You Must LOGIN first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("failure","You are not The Owner of This Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//Joi validate as middleware (Listing)
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body,{abortEarly:false});
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};
//Joi validate as middleware (Review)
module.exports.validateReview=(req,res,next)=>{
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

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("failure","You are not The Author of This Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};