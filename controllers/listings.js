const Listing = require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}

module.exports.renderNewForm=async(req,res)=>{
    res.render("listings/new");
}

module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("failure","Listing You requested Not Exist");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show",{listing});
}

module.exports.createListing=async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing is Created");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("failure","Listing You requested Not Exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit",{listing});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Got Updated Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Got Deleted Successfully");
    res.redirect("/listings");
}