import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {connect} from './ConnectDB/connectToDb.js';
import userRoutes from './Routes/userRoutes.js';
import postRoutes from './Routes/postRoutes.js';
const app=express();
const port=process.env.PORT || 5000;

connect();


//Middlewares
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true })); 
app.get("/",(req,res)=>{
	return res.status(200).json({status:true,message:"Server Started"});
});

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.listen(port,()=>console.log(`Listening on port ${port}`)); 

