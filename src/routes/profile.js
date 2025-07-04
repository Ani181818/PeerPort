const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditPassword } = require("../utils/validation");

const profileRouter = express.Router();


profileRouter.get("/profile/view",userAuth,async(req,res) => {
    
    try{
        
        const user = req.user;

        res.send(user)

    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res) => {
    
    
    try{
        
        if(!validateEditProfileData(req)){
            throw new Error("Cant Update")
        }

        const existingUser = req.user;
        const updatedUser = req.body;

        Object.keys(updatedUser).forEach((key) => existingUser[key] = updatedUser[key]);

        await existingUser.save();

        res.json({message:`${existingUser.firstName}, Your profile Updated successfully`,
        data : updatedUser})


    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=> {

    try{
        if(!validateEditPassword(req)){
            throw new Error("Cant Update PassWord");
        }

        const loggedInUser = req.user;
        const updatedUser = req.body;
        
        loggedInUser.password = updatedUser.password;

        await loggedInUser.save();

        res.json({message :`${loggedInUser.firstName}, Your PassWord Has been Updated Successfully`,
            data: updatedUser
        }
        )

    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

module.exports = profileRouter;