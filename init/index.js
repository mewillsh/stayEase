const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
console.log("DB URL from .env:", process.env.ATLASDB_URL);

const mongoose=require("mongoose");
const intiData=require("./data.js");
const Listing=require("../models/listing.js");
const dbUrl=process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("Connect to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
    async function main() {
        await mongoose.connect(dbUrl);
    }

const initDB=async()=>{
  await Listing.deleteMany({});
  intiData.data=intiData.data.map((obj)=>({...obj,owner:"686d17a6464f3f6b5f168bb9"}));
  await Listing.insertMany(intiData.data);
  console.log("data was initialized");
}
initDB();