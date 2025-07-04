const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const {validateSignUp} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")


app.use(express.json());
app.use(cookieParser());


app.post("/signup",async(req,res) => {

    
    try{
    // Validation Of data
    validateSignUp(req);
    const {password,firstName,lastName,emailId} = req.body;
    //Encrypt the password
    const passwdHash = await bcrypt.hash(password,10);
    //Now Save it
    const user = new User({firstName,lastName,emailId,password:passwdHash});
    await user.save();
    res.send("User Added Successfully")
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

app.post("/login",async(req,res) => {
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isMatch = await user.passwordValidator(password);
        if(isMatch){
            //Create a JWT Token
            const token = await user.creatingJWTToken();
            //Add the token to cookie and send the response back to user
            res.cookie("token",token,{expires: new Date(Date.now()+8*3600000)})
            res.send("Login Success");
            
        }else{
        throw new Error("Invalid Credentials")
        }
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

app.get("/profile",userAuth,async(req,res) => {
    
    try{
        
        const user = req.user;

        res.send(user)

    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

app.post("/sendingConnectionRequest",userAuth,async(req,res) => {
    res.send(req.user.firstName+" sent a request")
})

 

connectDB().then(()=>{
    console.log("Connected to MongoDB")
    app.listen(7777,()=> {
    console.log("Server is running on port 7777");
});
}).catch((err)=>{
    console.error("DB Cannot be Connected")
});


