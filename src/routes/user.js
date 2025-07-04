const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res)=> {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId","firstName lastName age gender photoURL skills")

        

        res.json({message:"Data Fetched Successfully",
            data:connectionRequest})
    }
    catch(err){
        res.status(400).send("Error :"+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName age gender about skills")
        .populate("toUserId","firstName lastName age gender about skills")

        const data = connectionRequests.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId;
        })

        res.json({data});

    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }
})

module.exports = userRouter;