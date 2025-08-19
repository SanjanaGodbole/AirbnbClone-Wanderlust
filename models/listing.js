//Listing-Multiple Places

const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
//Instead of using mongoose.Schema everytime we can simply use Schema

// 


//Listing Schema
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    // image:{
    //     type:String,
    //     //no img sent:img is undefined
    //    // default:"https://images.unsplash.com/photo-1589419896452-b460b8b390a3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     //img is sent but empty
    //     set: (v) => v && typeof v === "string" ? v.trim() : undefined

    // },
     image: {
        filename: {
            type: String,
            //no img sent:img is undefined
            default:"https://images.unsplash.com/photo-1589419896452-b460b8b390a3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            //img is sent but empty
            set: (v) => v && typeof v === "string" ? v.trim() : undefined
        },
        url: {
            type: String,
            required: true,
            trim: true
        }
    },

    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});


//Post Mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

//Model(Table) creation
const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;

