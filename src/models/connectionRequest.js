const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
         required:true
    },
    status:{
        type:String,
         required:true,
        enum:{
            values:["intrested","accepted","rejected","ignored"],
            message:"Invalid status"
        }
    }
},{timestamps:true})

connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre("save",function (next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't send a connection request to yourself");
    }

    next();
})

module.exports = new mongoose.model("ConnectionRequest",connectionRequestSchema);