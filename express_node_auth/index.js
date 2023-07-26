const express=require("express");
const mongoose=require("mongoose");
const authRoutes=require("./routes/authRoutes");
const cookieParser=require("cookie-parser");
const {requireAuth,checkUser}=require("./middleware/authMiddleware");
require("dotenv").config();

const app=express();

//Middleware
app.use(express.static("public"));
app.use(cookieParser());

// view engine

app.set("view engine","ejs");

app.use(express.json());
const port=3000;
//Database connection

const dbURI=process.env.dbURI;


mongoose.connect(dbURI,{})
.then((result)=>app.listen(port,()=>console.log(`Express app listening at https://localhost:${port}`)))
.catch((err)=>console.log(err));

//routes
app.get('*', checkUser);
app.get("/",(req,res)=>res.render("home"));

app.get("/smoothies",requireAuth,(req,res)=>res.send("smoothies"));
app.use(authRoutes);


