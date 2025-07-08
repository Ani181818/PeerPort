const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res)=> {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId","firstName lastName age gender photoURL skills")

        

        res.send(connectionRequest);
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

        res.send(data);

    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }
})

userRouter.get("/user/feed",userAuth,async(req,res)=> {
    try{
         const loggedInUser = req.user;
         const page = req.query.page || 1;
         let limit = req.query.limit || 10;
         limit = limit>50?50:limit;
         const skip = (page-1)*limit;
         const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
         }).select("fromUserId toUserId")

         const hideUsersFromFeed = new Set();

         connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.toUserId.toString());
            hideUsersFromFeed.add(req.fromUserId.toString());
         })

         const users = await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
         }).select("firstName lastName age gender about skills photoURL").skip(skip).limit(limit)

         res.send(users);
    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }
})

module.exports = userRouter;