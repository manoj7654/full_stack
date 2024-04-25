const express=require("express");

// const { authenticate } = require("../middleware/userAuthentication");
const userRouter=express.Router();

const { signup,login, changePassword } = require("../controller/userController");
const { authenticate } = require("../middleware/authenticate");




userRouter.post("/register",signup);

userRouter.post("/login",login);
userRouter.post("/change",authenticate,changePassword);

module.exports={userRouter}