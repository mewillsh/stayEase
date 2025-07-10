const mongoose =require("mongoose");
const reviews = require("./reviews.js");
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
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

listingSchema.post("findOneAndDelete",async(doc)=>{
  if(doc){
    await reviews.deleteMany({_id:{$in: doc.reviews}});
  }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;