const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://iitb-wustl.org/images/banner-2.jpg",
      set: (v) => (v === "" ? "https://iitb-wustl.org/images/banner-2.jpg" : v),
    },
  },
  price: {
    type: Number,
    default: 0
  },
  location: String,
  country: String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;