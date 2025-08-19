const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");

const Review=require("../models/review");
const Listing=require("../models/listing");
const reviewSchema=require("../Schema.js")

const validateReview = (req, res, next) => {
  //console.log("req.body validateReview ===>", req.body);

  if (!req.body) {
    return next(new ExpressError(400, "Missing request body"));  // ⬅️ return added
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    return next(new ExpressError(400, msg));  // ⬅️ return added
  }

  next();
};



//Routes for Reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{

    console.log("Review Route");
    let listingData=await Listing.findById(req.params.id).populate("reviews");
    let newReview=new Review(req.body.review);
    listingData.reviews.push(newReview);
    await newReview.save();
    await listingData.save();
   
   // res.render("listings/show", { listingData });
    res.redirect(`/listings/${listingData._id}`);

}));

//Delete Route for Reviews
 router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    console.log("Delete Route for Review")
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    let deletedReview=await Review.findByIdAndDelete(reviewId);
    console.log("Deleted Reviews",deletedReview);
    res.redirect(`/listings/${id}`)

 }))

 module.exports=router;