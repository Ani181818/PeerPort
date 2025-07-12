const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req,res,next)=>{
    try{
      const {token} = req.cookies;
        if(!token){
        return res.status(401).sned("Please Login!");
        }
      const decodedMSG = await jwt.verify(token, process.env.JWT_SECRET);
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