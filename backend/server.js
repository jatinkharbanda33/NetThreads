import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
import userRoutes from './Routes/userRoutes.js';
import postRoutes from './Routes/postRoutes.js';
const app=express();
const port=process.env.PORT || 5000;

//Middlewares
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true })); 
const uri=process.env.MONGO_DB_URI;
	const client = new MongoClient(uri);
	await client.connect();
	app.locals.db=client.db("Threads");
	console.log("Connected to MongoDB");
app.get("/",async (req,res)=>{
	try{
	return res.status(200).json({status:true,message:"Server Started"});
		
	}
	catch(err){
		console.log(err.message);
		return res.status(500).json({status:false,message:"Internal Server Error"});
	}
});

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.listen(port,()=>console.log(`Listening on port ${port}`)); 

