//Server creation using express
const express=require("express");
const app=express();

const mongoose=require("mongoose");
const methodOverride = require('method-override');


//Associate session with application
const session=require("express-session");
const flash=require("connect-flash");
const sessionOptions={
    secret:"secretcode",
    resave:"false",
    saveUninitialized:false,
    cookie:{
       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly:true //to prevent from cross scripting attack        
    }
}
app.use(session(sessionOptions));
app.use(flash());//always before routes

const listenings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

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

//Without this, Express has no idea how to parse incoming JSON data, which makes req.body completely undefined
//before any route declarations
app.use(express.json());


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

//Server listing to 8080 port
    app.listen(8080,()=>{
    console.log("Server is listening to port 8080")
});


//////////// Express Routes for Listings //////////////////////

app.use("/listings",listenings);
app.use("/listings/:id/reviews",reviews);

///////////////////////////////////////////////////////////////


//////////////////////Page Not Fount(Route is not defined)/////////////Not Working Need to check
// app.all("*", (req, res, next) => {
//      console.log("Unmatched route hit:", req.originalUrl);

//   next(new ExpressError(404, "Page Not Found"));
// });


///////////////////////////////////////////////////////////////////////
//Error Handling Custom Middleware

app.use((err,req,res,next)=>{
// res.send("Something went wrong....Handled by Custom Error Hndlig Middleware....")
    //Custom ExpressError class
    let{statusCode=500,message="Something went wrong"}=err;
    //res.status(statusCode).send(message);
     res.status(statusCode);
    console.log("Error Msg using ExpressError Class",message)
    res.render("Error.ejs",{err});
    // res.status(500).json({
    // status: statusCode,
    // message: message
    // });
                        
})

//app.js is the main entry point of the application, where you set up the server, connect to the database, and define routes for handling requests.
//It serves as the backbone of your Express application, coordinating various components and functionalities.           

//Errorhandling 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


