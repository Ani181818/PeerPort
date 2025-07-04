const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req,res,next)=>{
    try{
      const {token} = req.cookies;
        if(!token){
        throw new Error("Token Is Not Valid")
        }
      const decodedMSG = await jwt.verify(token,"DEV@TINDER123");
       const {_id} = decodedMSG;
       
       const user = await User.findById(_id);
      if(!user){
        throw new Error("User Not Found");
      }
      req.user = user;
      next();
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }

}

module.exports = {userAuth}