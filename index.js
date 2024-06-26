const express=require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRouter");


const app=express();


require("dotenv").config();





app.use(express.json())

app.use("/users",userRouter)


app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on port no ${process.env.port}`)
})
