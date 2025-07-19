const Listing = require("../models/listing.js");
const geocodeLocation=require("../utils/geoCoder.js");
const axios =require("axios");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;
  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index", { allListings, category });
};

module.exports.renderNewForm=async(req,res)=>{
    res.render("listings/new");
}

module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing.geometry)
    if(!listing){
      req.flash("failure","Listing You requested Not Exist");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show",{listing});
}

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  // Use utility function here
  newListing.geometry = await geocodeLocation(newListing.location);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing is Created");
  res.redirect("/listings");
};


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("failure","Listing You requested Not Exist");
      return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit",{listing,originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Merge form data
    const updatedData = req.body.listing;
    Object.assign(listing, updatedData);

    // Handle image update if new image is uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Update geolocation based on new location input
    if (updatedData.location !== listing.location) {
      listing.geometry = await geocodeLocation(updatedData.location);
    }

    await listing.save();

    req.flash("success", "Listing got updated successfully");
    res.redirect(`/listings/${id}`);

  } catch (error) {
    console.error("Update Error:", error);
    req.flash("error", "Something went wrong during update");
    res.redirect("/listings");
  }
};



module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Got Deleted Successfully");
    res.redirect("/listings");
}