import jwt from "jsonwebtoken";
const generateAccessToken=(userId)=>{
    const payload={userId};
    const token=jwt.sign(payload,process.env.ACCESS_JWT_SECRET,{
        expiresIn:"1d",
    });
    return token;
}
const generateRefreshToken=(userId)=>{
    const payload={userId};
    const token=jwt.sign(payload,process.env.REFRESH_JWT_SECRET,{
        expiresIn:"15d",
    });
    return token;
}
export {generateAccessToken,generateRefreshToken};