import { ObjectId } from "mongodb";
import { getDb } from "../ConnectDB/connectToDb.js";
const searchByUsername=async(req,res)=>{
    try{
        const db=getDb();
        const {username,lastFetchedId}=req.body;
        if(!lastFetchedId) lastFetchedId=0;
        lastFetchedId=ObjectId(lastFetchedId);
        if(!username || username.length==0) return res.status(400).json({status:false,error:"Invalid username"});
        const pipeline=[
            {$match:{
                username:{
                    $regex: "^" + username, $options: "i"
                },
                _id:{$gt:lastFetchedId}
            }},
            {$sort:{
                _id:1
            }},
            {$limit:12},
            {
                $project:{
                    username:1,
                    name:1,
                    profilepicture:1,
                    
                }
            }
        ]
        const getUsers= await db.collection('Users').aggregate(pipeline).toArray();
        return res.status(200).json({status:true,data:getUsers});
        

    }
    catch(err){
        return res.status(500).json({status:false,error:"Internal Server Error"})
    }
}
export {searchByUsername}