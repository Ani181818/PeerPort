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

const validateEditProfileData = (req) => {
    const ALLOWED_UPDATES = ["firstName","lastName","age","skills","about","photoURL"]

        const isAllowedFieldsUpdate = Object.keys(req.body).every((key) => ALLOWED_UPDATES.includes(key));

        if(!isAllowedFieldsUpdate){
            throw new Error("Can Not Update!")
        }
        return isAllowedFieldsUpdate;
}

const validateEditPassword = (req) => {
    const isAllowed = Object.keys(req.body).every((key) => "password" === key);

    if(!isAllowed){
        throw new Error("Cant Update Password");
    }

    if(!validator.isStrongPassword(req.body.password)){
        throw new Error("Please Enter a Strong password");
    }

    return true;

}

module.exports = {validateSignUp,validateEditProfileData,validateEditPassword};