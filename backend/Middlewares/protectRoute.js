import { Users } from "../ConnectDB/getData.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const protectRoute = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    if (!headers || !headers.startsWith("Bearer ")) {
      return res.status(401).json({ status:false, message: "Unauthorized" });
    }
    const token = headers.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ status:false, message: "Unauthorized" });
    }
    let decode;
    try{
    decode = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(errr){
      return res.status(400).json({status:false, message:"Invalid Token"});
    }
    if (!decode || !decode.userId) {
      return res.status(401).json({ status:false,  message: "Invalid token" });
    }

    const userCollection = await Users();
    const userId = String(decode.userId);
    const currentuser = await userCollection.findOne(
      { _id: new ObjectId(userId) , token:token},
      { projection: { password: 0 } }
    );

    if (!currentuser) {
      return res.status(401).json({status:false, message: "User not found" });
    }

    req.user = currentuser; 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:false, error: "Internal Server Error" });
  }
};

export default protectRoute;
