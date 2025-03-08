import config from '../Config/config.js';
import jwt from "jsonwebtoken";
const generateAccessToken=(userId)=>{
    const payload={userId };
    const token=jwt.sign(payload,config.ACCESS_JWT_SECRET,{
        expiresIn:"1d",
    });
    return token;
}
const generateRefreshToken=(userId)=>{
    const payload={userId};
    const token=jwt.sign(payload,config.REFRESH_JWT_SECRET,{
        expiresIn:"15d",
    });
    return token;
}
export {generateAccessToken,generateRefreshToken};