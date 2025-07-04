const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendingConnectionRequest",userAuth,async(req,res) => {
    res.send(req.user.firstName+" sent a request")
})

module.exports = requestRouter;