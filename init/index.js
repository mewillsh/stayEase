const mongoose=require("mongoose");
const intiData=require("./data.js");
const Listing=require("../models/listing.js");

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

const initDB=async()=>{
  await Listing.deleteMany({});
  intiData.data=intiData.data.map((obj)=>({...obj,owner:"686d17a6464f3f6b5f168bb9"}));
  await Listing.insertMany(intiData.data);
  console.log("data was initialized");
}
initDB();