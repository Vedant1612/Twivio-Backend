// require('dotenv').config({path: './env'})

// It can easily work , but this "required" syntax reduces our consistency of project therefor we use following method : for which make change in script in packet.jason file...

import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    const port = process.env.PORT || 8000
    app.listen(port, ()=>{
         console.log(`Server is running on port: ${port}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed !!", error);
})






/*
This is one type of method of connecting the DB to our server , but this is not a good approach as it pollutes our index.js file and also this is not used in large projects.Instead we create another file and import it here..(that method is done above . . . )

import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express()
( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("Err : ",error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port : ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()
*/