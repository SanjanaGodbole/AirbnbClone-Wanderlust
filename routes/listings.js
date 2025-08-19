const express=require("express");
const router=express.Router();


const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");

const Listing=require("../models/listing");

//Routes for Listing
//Index route

//app.get("/listings", async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const allListings = await Listing.find({});
         res.render("listings/index", { allListings }); 
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Specific routes (/listings/new) should come before dynamic ones(/listings/:id)

//Since :id is a dynamic parameter, Express may interpret "new" as an ID instead of a separate route. 
// This could cause errors like CastError: Cast to ObjectId failed for value "new".

//Create new property
// 1.New Route- To display form to get details about new property
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// 2.Create route-Collect all entered details from request body and store it in MongoDB table-listings using Model Listing

//<input name="title" placeholder="Enter Title" type="text"/>
//let {title,description,image,price,country,location}=req.body;

//<input name=listing[title] placeholder="Enter Title" type="text"/>
//let listing=req.body.listing;

//app.use(express.urlencoded({extended:true}))
//The app.use(express.urlencoded({ extended: true })) middleware in Express.js 
// is used to parse incoming URL-encoded form data and make it accessible via req.body


//////Custom WrapAsync////
router.post("/",wrapAsync(async(req,res,next)=>{
    let listing=req.body.listing;
    const updatedListing = {
    ...listing,
    image: {
        url: listing.image,
        filename: "listingimage"
    }
    };
    const newListing=new Listing(updatedListing);
    await newListing.save();
    res.redirect("/listings");
      
}));




///////////////////////////////////////////////////////////////////////////////////////////////////
//Edit Property Details

//1.Edit Route to Display edit form
router.get("/:id/edit",async(req,res)=>{
    const {id}=req.params;
   let listingData=await Listing.findById(id);
    res.render("listings/edit.ejs",{listingData});
})

//2.Update Route to save edited data about propert into Mongo DB
router.put("/:id",async(req,res)=>{
    const {id}=req.params;
    const listingData = req.body.listing;

const updatedListing = {
  ...listingData,
  image: {
    url: listingData.image,
    filename: "listingimage" 
  }
};
   //await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
   await Listing.findByIdAndUpdate(id,updatedListing); 
  res.redirect("/listings");
})


//useful when handling HTTP methods like PUT and DELETE in forms since HTML forms only support GET and POST.
//you're telling Express to look for a _method query parameter in the request and override the method accordingly.
//Even though the form submits a POST request, methodOverride will convert it into a PUT request.
//app.use(methodOverride("_method"));

///////////////////////////////////////////////////////////////////////////////

//Delete Route
router.delete("/:id",async(req,res)=>{
     const {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id); 
     res.redirect("/listings");
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////

//Show route- READ operation to dsplay detail info of selected proeprty(using id) from listings
//This request is coming from anchor tag, which always send GET request when clicked
router.get("/:id",async(req,res)=>{
   // const listingId = req.params.id;
   const {id}=req.params;
   let listingData=await Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs",{listingData});

})


module.exports=router;