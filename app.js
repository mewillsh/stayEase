const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

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

app.set("view engine","ejs"); //for setting ejs view engine
app.set("views",path.join(__dirname,"views")); //go to views folder for ejs
app.use(express.urlencoded({extended:true}));//to parse data came in URL
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const sessionOptions={
    secret:"MySecretCode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        //This cookie will persist for 7 days
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpsOnly:true
    }
}
app.get("/",async(req,res)=>{
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{  //if flash is triggered then it will get saved in res.locals and passed in ejs
    res.locals.successful=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/registerUser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"student1234@gmail.com",
//         username:"mewillsh",
//     });
//     let newUser=await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// })

app.use("/listings",listingsRouter);  //Listing Router
app.use("/listings/:id/reviews",reviewsRouter);  //Review Router
//Writing the next in this way because this is how async error handing is happend
app.use("/",userRouter);
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
//Error-Handling Middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs", { err });
    // res.render("error.ejs",{err});
    //res.status(statusCode).send(message);
});
// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });
//     await sampleListing.save(),
//     console.log("Sample was saved");
//     res.send("Successful testing");
// }) 
app.listen(8080,()=>{
    console.log("Server is listning is port 8080");
});