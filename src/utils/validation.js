const validator = require("validator")
const validateSignUp = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName || !emailId || !password){
        throw new Error("Please fill all the fields")
    }
    else if(firstName.length == 0){
        throw new Error("Name Is Not Valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Enter Valid Email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong password");
    }
}

module.exports = {validateSignUp};