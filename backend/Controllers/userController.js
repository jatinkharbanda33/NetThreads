import bcrypt from "bcryptjs";
import {generateAccessToken,generateRefreshToken} from "../utils/generateToken.js";
import { ObjectId } from "mongodb";
import { putObjectinS3 } from "../utils/s3bucket.js";
import { getDb } from "../ConnectDB/connectToDb.js";
import jwt from "jsonwebtoken";
const signupUser = async (req, res) => {
  try {
    const db=getDb();
    const { name, username, password } = req.body;
    const user = await db.collection('Users').findOne({
       username: username 
    });
    if (user) {
      return res.status(400).json({ status:false,error: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const newUser = await db.collection('Users').insertOne({
      name: name,
      username: username,
      password: hashedpassword,
      profilepicture: null,
      bio: null
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser.insertedId,
        name: name,
        username: username,
      });
    } else {
      res.status(400).json({status:false, error: "Invaliad User Data" });
    }
  } catch (err) {
    res.status(500).json({status:false, error: 'Internal Server Error' });
  }
};
const loginUser = async (req, res) => {
  try {
    const db=getDb();
    const { username, password } = req.body;
    const user = await db.collection('Users').findOne({ username: username });
    if (!user) return res.status(400).json({status:false, error: "Invalid Username" });
    const verifypassword = await bcrypt.compare(password, user.password);
    if (!verifypassword) res.status(400).json({status:false, error: "Wrong Password" });
    const authtoken = generateAccessToken(user._id);
    const refreshToken=generateRefreshToken(user._id);
    await db.collection('Users').updateOne(
      { _id: user._id },
      { $set: { token: authtoken } }
    );
    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      secure:false,
      maxAge:15*24*60*60*1000,
    })
    res.status(200).json({
      status:true,
      _id: user._id,
      name: user.name,
      username: user.username,
      profilepicture: user.profilepicture,
      bio: user.bio,
      token: authtoken
    });
  } catch (err) {
    console.log(err.message,err.stack);
    res.status(500).json({status:false, error: 'Internal Server Error' });
  }
};
const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const db=getDb();
    await db.collection('Users').updateOne({ _id: userId }, { $set: { token: null } });
    res.clearCookie('refreshToken',{
      httpOnly:true,
      secure:false,
      maxAge:15*24*60*60*1000,
    })
    res.status(200).json({
      message: "Logged Out Succesfully",
    });
  } catch (err) {
    return res.status(500).json({ status:false,error: 'Internal Server Error' });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const id = new ObjectId(String(req.params.id));
    const db=getDb();
    const user = await db.collection('Users').findOne(
      { _id: id },
      { projection: { password: 0, token: 0 } }
    );
    if (!user) return res.status(400).json({ status:false,error: "user Not Found" });
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({status:false, error: 'Internal Server Error' });
  }
};
/* const followUnfollowUser = async (req, res) => {
  try {
    const targetUserId = new ObjectId(String(req.params.id));
    const currentUserId = req.user._id;
    const userCollection = await Users();

    const userToModify = await userCollection.findOne({ _id: targetUserId });
    const currentUser = await userCollection.findOne({ _id: currentUserId });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User Not Found" });
    const followingCollection = await Following();
    const followersCollection = await Followers();
    const isFollowingAlready = await followingCollection.findOne({
      userId: currentUserId,
      following: targetUserId,
    });
    if (isFollowingAlready) {
      await followingCollection.deleteOne({ _id: isFollowingAlready._id });
      await userCollection.updateOne(
        { _id: currentUser },
        { $inc: { following_count: -1 } }
      );
      await userCollection.updateOne(
        { _id: targetUserId },
        { $inc: { follower_count: -1 } }
      );
      await followersCollection.deleteOne({
        userId: targetUserId,
        follower: currentUserId,
      });
      return res.status(201).json({
        message: "User Unfollowed Successfully",
      });
    } else {
      await userCollection.updateOne(
        { _id: currentUser },
        { $inc: { following_count: 1 } }
      );
      await userCollection.updateOne(
        { _id: targetUserId },
        { $inc: { follower_count: 1 } }
      );
      await followingCollection.insertOne({
        userId: currentUserId,
        following: targetUserId,
      });
      await followersCollection.insertOne({
        userId: targetUserId,
        follower: currentUserId,
      });
      return res.status(201).json({
        message: "User Followed Successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; */
const getUserByToken=async(req,res)=>{
  try{
    const currentuser=req.user;
    return res.status(200).json(currentuser);
  }
  catch(err){
    res.status(500).json({status:false,error:'Internal Server Error'});
  }
}
const updateProfilePicture=async(req,res)=>{
  try{
    const db=getDb();
    const {file_name,file_content_type}=req.body;
    const userId=req.user._id;
    const {url,status,error,key}=await putObjectinS3(file_name,req.user.username,file_content_type,"dp");
    if(!status) return res.status(400).json({status:false,error:error});
    await db.collection('Users').updateOne({_id:userId},{$set:{profilepicture:key}});
    return res.status(201).json({status:true,url:url,imageurl:key});

  }
  catch(err){
    res.status(500).json({status:false,error:'Internal Server Error'});

  }
}
const updateUserDetails = async (req, res) => {
  try {
    const db=getDb();
    const { name, username } = req?.body;
    const currentUser = req.user;
    const setFields = {};
    if (username && username.length > 0 && username != currentUser.username) {
      const user = await db.collection('Users').findOne({
        username: username,
      });
      if (user) {
        return res.status(400).json({status:false, error: "User Already Exists" });
      }
      setFields.username = String(username);
    }
    if (name && name.length > 0 && currentUser.name != name) {
      setFields.name = String(name);
    }
    await db.collection('Users').updateOne(
      { _id: currentUser._id },
      { $set: setFields }
    );
    return res
      .status(200)
      .json({
        status: true,
        message: "User Fields Updated Successfully",
      });
  } catch (err) {
    return res.status(500).json({status:false, error: 'Internal Server Error' });
  }
};
const refreshToken=async(req,res)=>{
  try{
    const refreshToken=req.cookies?.refreshToken;
    console.log(req.cookies);
    console.log(refreshToken);
    if(!refreshToken) return res.status(401).json({status:false,error:"Unauthorized"});
    let decode;
    try{
    decode = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    }
    catch(err){
     console.error(err.message,err.stack);
      return res.status(400).json({status:false, error:"Invalid Token"});
    }
    const accessToken=generateAccessToken(decode.userId);
    return res.status(200).json({status:true,authToken:accessToken});
  }
  catch(err){
    console.error(err.message,err.stack);
    return res.status(500).json({status:false, error: 'Internal Server Error' });
  }
}


export {
  signupUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserByToken,
  updateProfilePicture,
  updateUserDetails,
  refreshToken
};
