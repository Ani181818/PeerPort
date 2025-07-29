require('dotenv').config();

const express = require("express");
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");
const http = require("http");
 
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/", uploadRouter);
app.use("/", chatRouter);


const server = http.createServer(app);

initializeSocket(server);



connectDB().then(()=>{
    console.log("Connected to MongoDB")
    server.listen(7777,()=> {
    console.log("Server is running on port 7777");
});
}).catch((err)=>{
    console.error("DB Cannot be Connected")
});


