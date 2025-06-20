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
      default: "https://example.com/default-image.jpg",
      set: (v) => (v === "" ? "https://example.com/default-image.jpg" : v),
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;