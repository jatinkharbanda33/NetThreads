import { Users, Followers, Following } from "../ConnectDB/getData.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { ObjectId } from "mongodb";

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const userCollection = await Users();
    const user = await userCollection.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (user) {
      return res.status(400).json({ error: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const newUser = await userCollection.insertOne({
      name: name,
      email: email,
      username: username,
      password: hashedpassword,
      profilepicture: null,
      bio: null,
      follower_count: 0,
      following_count: 0,
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser.insertedId,
        name: name,
        email: email,
        username: username,
      });
    } else {
      res.status(400).json({ error: "Invaliad User Data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userCollection = await Users();
    const user = await userCollection.findOne({ username: username });
    if (!user) return res.status(400).json({status:false, error: "Invalid Username" });
    const verifypassword = await bcrypt.compare(password, user.password);
    if (!verifypassword) res.status(400).json({status:false, error: "Wrong Password" });
    const authtoken = generateToken(user._id);
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { token: authtoken } }
    );
    res.status(200).json({
      status:true,
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilepicture: user.profilepicture,
      bio: user.bio,
      token: authtoken,
      follower_count: user.follower_count,
      following_count: user.following_count,
    });
  } catch (err) {
    res.status(500).json({status:false, error: err.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userCollection = await Users();
    await userCollection.updateOne({ _id: userId }, { $set: { token: null } });
    res.status(200).json({
      message: "Logged Out Succesfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = new ObjectId(String(req.params.id));
    
    const userCollection = await Users();
    const user = await userCollection.findOne(
      { _id: id },
      { projection: { password: 0, token: 0 } }
    );
    if (!user) return res.status(400).json({ error: "user Not Found" });
    const followingCollection=await Following();
    const isfollowedbyuser=await followingCollection.findOne({userId:userId,following:id})
    res.status(200).json({...user,isfollowing:isfollowedbyuser?1:0});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const followUnfollowUser = async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
};
const getUserByToken=async(req,res)=>{
  try{
    const currentuser=req.user;
    return res.status(200).json(currentuser);
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}

export {
  signupUser,
  loginUser,
  logoutUser,
  getUserProfile,
  followUnfollowUser,
  getUserByToken
};
