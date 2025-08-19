const mongoose=require("mongoose");

const initData=require("./data.js");
const Listing=require("../models/listing.js");

//Creation of DB connectivity
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const main=async()=>{
    await mongoose.connect(MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
}

main()
    .then(()=>{console.log("MongoDB connection Successful")})
    .catch((err)=>{console.log("Error while connecting to DB")});


const initDB=async()=>{
    await Listing.deleteMany({});
    //console.log("Init data",initData.data)
   await Listing.insertMany(initData.data);
   console.log("Data initialized successfully")

}

initDB();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

