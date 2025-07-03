const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const adminUser = token==="xyz";
    if(!adminUser){
        res.status(401).send("Unauthorized Access")
    }else{
        next();
    }
}

module.exports = {adminAuth}