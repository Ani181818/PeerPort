const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const {validateSignUp} = require("./utils/validation")
const bcrypt = require("bcrypt");
app.use(express.json());

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
        res.send(err.message)
    }
})

app.get("/feed",async(req,res) => {
    try{
    const user = await User.find({});
    res.send(user);
    }
    catch(err){
        res.send.status(404).send("User Not Fiund");
    }
})

app.get("/user",async(req,res) => {
    const userName = req.body.firstName;
    try{
        const user = await User.find({firstName:userName})
        res.send(user);
    }
    catch(err){
        res.send.status(404).send("User Not Fiund");
    }
})

app.delete("/user",async(req,res) => {
    const userId = req.body.userId;
    
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send("User Deleted Successfully")
    }
    catch(err){
        res.send.status(404).send("User Not Fiund");
    }
})

app.patch("/user/:userId",async(req,res) => {
    const userId = req.params?.userId;
    const user = req.body;

    try{
        const ALLOWED_UPDATED = ["photoURL","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(user).every((k) => ALLOWED_UPDATED.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update is Not Allowed")
        }
        if(user?.skills.length > 10){
            throw new Error("Skills Cannot be More Than 10")
        }
        await User.findByIdAndUpdate(userId,user,{runValidators:true});
        res.send("User Updated Successfully");

    }
    catch(err){
        res.status(404).send("Update Failed:"+err.messaage);
    }
    
})

connectDB().then(()=>{
    console.log("Connected to MongoDB")
    app.listen(7777,()=> {
    console.log("Server is running on port 7777");
});
}).catch((err)=>{
    console.error("DB Cannot be Connected")
});


