const express = require("express");
const { validateSignUp } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup",async(req,res) => {

    
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

authRouter.post("/login",async(req,res) => {
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

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires: new Date(Date.now())})
    res.send("Logout Success");
})

module.exports = authRouter;