const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId",userAuth,async(req,res) => {
    try{
        const fromUserId = req.user;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const VALID_STATUS = ["ignored","intrested"];

        if(!VALID_STATUS.includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }
        
        const toUser = await User.findById(toUserId);

        if(!toUser){
            return res.status(404).json({message:"User not found"});
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection request already sent"});
        }
        const connectionRequest = new ConnectionRequest({fromUserId,toUserId,status});

       
        const data = await connectionRequest.save();

        res.send(data);

    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res) => {
    try{
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        
        const VALID_STATUS = ["accepted","rejected"];
        if(!VALID_STATUS.includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }

        const connectionValid = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"intrested"
        })

        if(!connectionValid){
            return res.status(400).json({message:"Invalid request"});
        }

        connectionValid.status = status;

        const data = await connectionValid.save();

        res.send(data);


    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = requestRouter;