const mongoose = require("mongoose")

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://Aniket18:VNxFPf5rnxI3zq19@aniket18.rtehteg.mongodb.net/devTinder");
}

module.exports = connectDB;