//Server creation using express
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const Review=require("./models/review");
const methodOverride = require('method-override');


// const ExpressError = require('./expressError');


const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError.js");




//to setup ejs
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))


//extends EJS templating in Express.js by adding support for layouts, partials, and block template functions
const ejsMate=require("ejs-mate");
//sets up EJS-Mate as the templating engine for your Express app
app.engine("ejs",ejsMate);

//serving static file
app.use(express.static(path.join(__dirname,"/public")));

//middleware in Express.js that helps parse incoming URL-encoded form data.
app.use(express.urlencoded({extended:true}))


//useful when handling HTTP methods like PUT and DELETE in forms since HTML forms only support GET and POST.
//you're telling Express to look for a _method query parameter in the request and override the method accordingly.
//Even though the form submits a POST request, methodOverride will convert it into a PUT request.
app.use(methodOverride("_method"));


//Creation of DB connectivity
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const connectDB=async()=>{
    try
    {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connection Successful");
    }
    catch(err)
    {
        console.log("Error while connecting to DB",err)
    }
 
}

connectDB();

// const connectDB=async()=>{
//     await mongoose.connect(MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
// }
// connectDB()
//     .then(()=>{console.log("MongoDB connection Successful")})
//     .catch((err)=>{console.log("Error while connecting to DB")});


//Server listing to 8080 port
    app.listen(8080,()=>{
    console.log("Server is listening to port 8080")
});


//Actual Routes
console.log("Registering route: /listings");
//Index route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        //console.log("All Data====>",allListings)
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
//New Route- To display form to get details about new property
console.log("Registering route: /listings/new");
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//Create route-Collect all entered details from request body and store it in MongoDB table-listings using Model Listing

// app.post("/listings",async(req,res,next)=>{
//     //<input name="title" placeholder="Enter Title" type="text"/>
//     //let {title,description,image,price,country,location}=req.body;

//     //<input name=listing[title] placeholder="Enter Title" type="text"/>
//     //let listing=req.body.listing;
    
//     try{
//     let listing=req.body.listing;
//     const updatedListing = {
//     ...listing,
//     image: {
//         url: listing.image,
//         filename: "listingimage" // or generate a custom name if needed
//     }
//     };
//     const newListing=new Listing(updatedListing);
//     await newListing.save();
//     res.redirect("/listings");
//     }
//     catch(err)
//     {
//         next(err); //send err to custom error handling middleware
//     }
 
// })


console.log("Registering Post route: /listings");

//////Custom WrapAsync////
app.post("/listings",wrapAsync(async(req,res,next)=>{
       let listing=req.body.listing;
    const updatedListing = {
    ...listing,
    image: {
        url: listing.image,
        filename: "listingimage" // or generate a custom name if needed
    }
    };
    const newListing=new Listing(updatedListing);
    await newListing.save();
    res.redirect("/listings");
      
}));


//app.use(express.urlencoded({extended:true}))
//The app.use(express.urlencoded({ extended: true })) middleware in Express.js 
// is used to parse incoming URL-encoded form data and make it accessible via req.body


///////////////////////////////////////////////////////////////////////////////////////////////////
//Edit Property Details

console.log("Registering route: /listings/:id/edit");

//1.Edit Route to Display edit form
app.get("/listings/:id/edit",async(req,res)=>{
    const {id}=req.params;
   let listingData=await Listing.findById(id);
    //console.log("Data=====>",listingData)
    res.render("listings/edit.ejs",{listingData});
})

console.log("Registering Put route: /listings/:id");

//2.Update Route to save edited data about propert into Mongo DB
app.put("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    const listingData = req.body.listing;

const updatedListing = {
  ...listingData,
  image: {
    url: listingData.image,
    filename: "listingimage" // or generate a custom name if needed
  }
};
    //console.log("Updated Data======>",updatedListing)
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
console.log("Registering Delete route: /listings/:id");

app.delete("/listings/:id",async(req,res)=>{
     const {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id); 
     //console.log(deletedListing);
     res.redirect("/listings");
})


console.log("Registering READ route: /listings/:id");

//Show route- READ operation to dsplay detail info of selected proeprty(using id) from listings
//This request is coming from anchor tag, which always send GET request when clicked
app.get("/listings/:id",async(req,res)=>{
   // const listingId = req.params.id;
   const {id}=req.params;
   let listingData=await Listing.findById(id);
   res.render("listings/show.ejs",{listingData});

})
/////////////////////////////////////////////////////////////////
//Routes for Reviews
app.post("/listings/:id/review",async(req,res)=>{

    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.send("New Review Saved");

})

////////////////////////////////////////////////////////////////
//////////////////////Page Not Fount(Route is not defined)/////////////Not Working Need to check
// app.all("*", (req, res, next) => {
//      console.log("Unmatched route hit:", req.originalUrl);

//   next(new ExpressError(404, "Page Not Found"));
// });


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Error Handling Custom Middleware

app.use((err,req,res,next)=>{
// res.send("Something went wrong....Handled by Custom Error Hndlig Middleware....")

    //Custom ExpressError class
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).send(message);
    console.log("Error Msg using ExpressError Class",message)
    // res.status(500).json({
    // status: statusCode,
    // message: message
    // });
   
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////
//Testing routes

//API Route as it is sending JSON data as response
// app.get("/",(req,res)=>{
//     res.json({message:"I am Root"});
// })

//Simple Route as sending HTML contents as response
// app.get("/",(req,res)=>{
//     res.send("I am root");
// })

//Sending HTML formatted response
// app.get("/",(req,res)=>{
//     res.send("<h1>Welcome to Root Route </h1>")
// })

//Creation of sample data-Listing/Place
// app.get("/testListing",async(req,res)=>{

//     let sampelListing=new Listing({
//         title:"My Villa",
//         description:"By the beach ",
//         price:2000,
//         location:"Calangute,Goa",
//         coiuntry:"India"
//     })
//     await sampelListing.save();
//     console.log("Sample data saved successfully");
//     res.send("Testing Successful");
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////Error Handling/////////////////



// //Default error handling
// app.get("/err",(req,res)=>{
// abcd=abcd;
// //throw new Error("Something went wrong");
// })


// /////////////////////////////////////////////////////////////////////
// //Default error handling with Custom msg
// app.get("/wrong",(req,res)=>{
// //throw new Error("Something went wrong");//Error is inbuild class
// throw new ExpressError(401,"Something went wrong");//Custom error class
// })

// /////////////////////////////////////////////////////////////////////////////////////////
// //Error handling middleware1
// //Custom error handler - Global error handler
// app.use((err,req,res,next)=>{
//     console.log("----------------Error-----1----------------------");
//    //res.status(500).send("Internal Server Error: " + err.message);
    
//     let {status=500,message="Something went wrong"}=err
//     //res.status(status).send(message);
//     //res.send(err);
// res.status(500).json({
//   status: status,
//   message: message
// });

//    // res.send({status:err.status,message:err.message}); //Sending error to Client
//    //next(err);// again we are passing ctrl to default error handler as we are done with handling error by passing error 
// })

// //Error handling middleware2
// app.use((err,req,res,next)=>{
//     console.log("----------------Error-----2----------------------");
//    //res.status(500).send("Internal Server Error: " + err.message);
//    //res.status(500).send(err.message); //Sending error to Client
//    next(err);// again we are passing ctrl to default error handler as we are done with handling error by passing error 
// })

// app.get("/admin",(req,res)=>{
//     throw new ExpressError(401,"Access is forbidden");
    
// })


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////