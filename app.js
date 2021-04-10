//jshint esversion:6

const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrpyt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});



const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const secret="Thisisourlittlesecret";

userSchema.plugin(encrpyt,{secret:secret,encryptedFields:['password']});



const User=new mongoose.model("User",userSchema);





app.get("/",function(req,res){

    res.render("home.ejs");
})

app.get("/login",function(req,res){
    res.render("login.ejs");
})
app.get("/register",function(req,res){
    res.render("register.ejs");
})
app.get("/secret",function(req,res){
    res.render("secrets.ejs")
})
app.post("/register",function(req,res){
   const newUser=new User({
       email : req.body.username,
       password:req.body.password
   })
   newUser.save(function(err){
       if(err)console.log(err);
       else {
           res.render("secrets.ejs")
       }
   });

   
})
app.post("/login",function(req,res){
    const name=req.body.username;
    const pass=req.body.password;
    User.findOne({email:name},function(err,founcUser){
            if(err)console.log(err);
            else{
                if(founcUser){
                    if(founcUser.password===pass){
                       console.log(req.body.username+" "+req.body.password);
                       res.render("secrets.ejs")
                    }
                }
            }
    })
})













app.listen(3000,function(){
    console.log("Listening on port 3000");
})










