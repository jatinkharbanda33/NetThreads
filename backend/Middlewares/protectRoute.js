
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDb } from "../ConnectDB/connectToDb.js";
import config from "../Config/config.js"
import logger from "../utils/logger.js";
const protectRoute = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    if (!headers || !headers.startsWith("Bearer ")) {
      return res.status(400).json({ status:false, error: "Invalid Credentials" });
    }
    const token = headers.split("Bearer ")[1];
    if (!token) {
      return res.status(400).json({ status:false, error: "Invalid Credentials" });
    }
    let decode;
    try{
    decode = jwt.verify(token, config.ACCESS_JWT_SECRET);
    }
    catch(err){
      return res.status(401).json({status:false, error:"Unauthorized"});
    }

    const db=getDb();
    const userId = String(decode.userId);
    const currentuser = await db.collection('Users').findOne(
      { _id:new  ObjectId(userId)},
      { projection: { password: 0 } }
    );

    if (!currentuser) {
      return res.status(400).json({status:false, error: "User not found" });
    }

    req.user = currentuser; 
    next();
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ status:false, error: "Internal Server Error" });
  }
};

export default protectRoute;
