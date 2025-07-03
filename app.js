const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewsSchema } = require("./schema.js");
const MONGO_URL="mongodb://127.0.0.1:27017/StayNest";
main()
    .then(()=>{
        console.log("Connect to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs"); //for setting ejs view engine
app.set("views",path.join(__dirname,"views")); //go to views folder for ejs
app.use(express.urlencoded({extended:true}));//to parse data came in URL
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/",async(req,res)=>{
    res.send("Hi, I am root");
});
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
//Index Route
app.get("/listings",wrapAsync (async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}));
// New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});
// Show Route
app.get("/listings/:id", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing});
}));
//Create Listing route
app.post("/listings",validateListing, wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
}));
//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));
// //Update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
// //Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
//Review Post Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    console.log(req.body)
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));
//Writing the next in this way because this is how async error handing is happend
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
//Error-Handling Middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs", { err });
    // res.render("error.ejs",{err});
    //res.status(statusCode).send(message);
});
// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });
//     await sampleListing.save(),
//     console.log("Sample was saved");
//     res.send("Successful testing");
// }) 
app.listen(8080,()=>{
    console.log("Server is listning is port 8080");
});