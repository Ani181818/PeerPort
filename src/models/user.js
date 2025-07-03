const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true, 
        minLength:4  
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,  
        unique: [true, 'Email already exists'],
        lowercase: true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("EmailId Is Not Valid");
            }
        }
    },
    password: {
        type: String,
        required: true,   
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password");
            }
        }
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error(`${value} is not a valid gender`);
            }
        }, 
    },
    photoURL: {
        type: String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhtMRbtowke9ZnnGtyYJmIuJaB2Q1y5I-3IA&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo Url Is Not Valid");
            }
        }
    },
    about :{
        type:String,
        default : "default Discription"
    },
    skills : {
        type : [String],
    }
},
{timestamps:true});

module.exports = mongoose.model("User", userSchema);
