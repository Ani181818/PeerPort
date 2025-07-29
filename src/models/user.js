const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("EmailId Is Not Valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password");
        }
      },
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
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMDPW_uRwpxs51AdMd1f1vZuiw-ndAjk1yPg&s",
      
    },
    about: {
      type: String,
      default: "default Discription",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);


userSchema.index({firstName:1,lastName:1})
userSchema.methods.creatingJWTToken = async function(){
    const user = this;

    const token = await jwt.sign({_id:user._id}, "DEV@TINDER123",{expiresIn:"1d"})

    return token
}

userSchema.methods.passwordValidator = async function(passwordGivenByUser){
    const user = this;
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(passwordGivenByUser,hashedPassword);

    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema);
