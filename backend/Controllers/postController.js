import {
  Posts,
  Likes,
  Replies,
  Following,
  PostsMIS,
} from "../ConnectDB/getData.js";
import { ObjectId } from "mongodb";
import {putObjectinS3,getUrlinS3} from '../utils/s3bucket.js'
const getPost = async (req, res) => {
  try {
    const currentUserId=req.user._id;
    const postId = new ObjectId(String(req.params.id));
    const postCollection = await Posts();
    const pipeline=[
      {$match:{
        _id:postId,
      }},
      {$lookup:{
        from:"Likes",
        pipeline:[
          {$match:{
            postId:postId,
            userId:currentUserId
          }}
        ],
        as:"result"
      }},
      {$lookup:{
        from:"Users",
        localField:"postedBy",
        foreignField:"_id",
        as:"postedByUser"
      }},
      {$unwind:{
        path:"$postedByUser"
      }},
      {$project:{
        text:1,
        image:1,
        _id:1,
        result:1,
        timestamps:1,
        likesCount:1,
        repliesCount:1,
        name:"$postedByUser.name",
        username:"$postedByUser.username",
        profilepicture:"$postedByUser.profilepicture"
      }}
    ];
    const result=await postCollection.aggregate(pipeline).toArray();
    if(!result || result.length==0) return res.status(400).json({status:false,error:"Invalid Id"});
    return res.status(200).json({status:true,result:result[0]});
  } catch (err) {
    res.status(500).json({ status:false,error: err.message });
  }
};
const getFeedPosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const postsCollection = await Posts();
    const pipeline = [
      {
            $sort: {
              _id: -1,
            },
          },
          { $skip: skip },
          { $limit: limit},
          {$lookup:{
            from:"Users",
            localField:"postedBy",
            foreignField:"_id",
            as:"result"
    
          }},
      {$unwind:{
        path:"$result"
      }},
      {$project:{
        _id:1,
        text:1,
        image:1,
        likesCount:1,
        timestamps:1,
        repliesCount:1,
        postedBy:1,
        username:"$result.username"
        
      }}
    ];

    const feedPosts = await postsCollection.aggregate(pipeline).toArray();
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { text, file_name,file_content_type } = req.body;
    const creatorId = req.user._id;
    const postCollection = await Posts();
    const postsMisCollection = await PostsMIS();
    const currentDate = new Date().setHours(0, 0, 0, 0);
    if(!file_name || !file_content_type){
      await postsMisCollection.updateOne(
        { date: currentDate },
        {
          $inc: { postCount: 1 },
        },
      );
      const newPost = await postCollection.insertOne({
        postedBy: creatorId,
        text: text,
        image: null,
        likesCount: 0,
        timestamps: new Date(),
        repliesCount: 0
      });
      return res.status(201).json({ _id: newPost.insertedId,status:true});
    }
    else{
    const {url,status,error,key}=await putObjectinS3(file_name,req.user.username,file_content_type);
    if(!status) return res.status(400).json({status:false,error:error});
     await postsMisCollection.updateOne(
      { date: currentDate },
      {
        $inc: { postCount: 1 },
        
      },
      
    );
    const newPost = await postCollection.insertOne({
      postedBy: creatorId,
      text: text,
      image: key,
      likesCount: 0,
      timestamps: new Date(),
      repliesCount: 0
    });
    return res.status(201).json({ _id: newPost.insertedId,status:true,url:url });
  }
  } catch (err) {
    return res.status(500).json({ error: err.message,status:false });
  }
};
const likePost = async (req, res) => {
  try {
    const postId = new ObjectId(String(req.params.query));
    const postCollection = await Posts();
    const likesCollection = await Likes();
    const currentUserId = req.user._id;
    const isLiked = await likesCollection.findOne({
      postId: postId,
      userId: currentUserId,
    });
    if (isLiked) {
      await likesCollection.deleteOne({
        postId: postId,
        userId: currentUserId,
      });
      await postCollection.updateOne(
        { _id: postId },
        { $inc: { likesCount: -1 } }
      );
      return res.status(201).json({
        message: "Like Removed from Post Succesfully",
      });
    } else {
      await likesCollection.insertOne({
        postId: postId,
        userId: currentUserId,
      });
      await postCollection.updateOne(
        { _id: postId },
        { $inc: { likesCount: 1 } }
      );
      return res.status(201).json({
        message: "Liked the post Succesfully",
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const replyToPost = async (req, res) => {
  try {
    const postId = new ObjectId(String(req.params.id));
    const { text,image } = req.body;
    const currentUserId = req.user._id;
    const repliesCollection = await Replies();
    const postCollection = await Posts();
    await repliesCollection.insertOne({
      postId: postId,
      userId: currentUserId,
      text: text,
      image:image,
      inserted_at:new Date(),
      likesCount:0,
      repliesCount:0
    });
    await postCollection.updateOne(
      { _id: postId },
      { $inc: { repliesCount: 1 } }
    );
    return res
      .status(201)
      .json({status:true, message: "Reply added to the Post Successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = new ObjectId(req.params.id);
    const currentUserId = req.user._id;
    const postCollection = await Posts();
    const post = await postCollection.findOne({
      _id: postId,
      postedBy: currentUserId,
    });
    if (!post) return res.status(400).json({ error: "Invalid Request" });
    const likesCollection = await Likes();
    const repliesCollection = await Replies();
    await postCollection.deleteOne({ _id: postId });
    await likesCollection.deleteMany({ postId: postId });
    await repliesCollection.deleteMany({ postId: postId });
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getUserPosts = async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const skip = req.query.skip || 0;
    const limit = req.query.skip || 9;
    const postCollection = await Posts();
    const pipeline = [
      { $match: { postedBy: currentUserId } },
      { $sort: { timestamps: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ];
    const userPosts = await postCollection.aggregate(pipeline).toArray();
    return res.status(200).json(userPosts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getLikes = async (req, res) => {
  try {
    const postId = new ObjectId(String(req.params.id));
    const skip = req.query.skip || 0;
    const limit = req.query.skip || 40;
    const likesCollection = await Likes();
    const pipeline=[
      {$match:{
        postId:postId,
      }},
      {$skip:skip},
      {$limit:limit},
      {
        $lookup:{
          from:"Users",
          localField:"userId",
          foreignField:"_id",
          as:"result"
        }
      },
      {$unwind:{
        path:"$result"
      }},
      {$project:{
        __id:1,
        username:"$result.username",
        profile_picture:"$result.profilepicture",
        name:"$result.name"
      }}
    ]
    const postLikes = await likesCollection.aggregate(pipeline).toArray();
    return res.status(200).json(postLikes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getReplies = async (req, res) => {
  try {
    const postId = new ObjectId(String(req.params.id));
    const skip = req.query.skip || 0;
    const limit = req.query.skip || 40;
    const repliesCollection = await Replies();
    const pipeline=[
      {$match:{
        postId:postId,
      }},
      {
        $sort:{
          _id:1,
        }
      },
      {$skip:skip},
      {$limit:limit},
      {
        $lookup:{
          from:"Users",
          localField:"userId",
          foreignField:"_id",
          as:"result",
        }
      },
      {$unwind:{
        path:"$result"
      }},
      {$project:{
        __id:1,
        username:"$result.username",
        profile_picture:"$result.profilepicture",
        name:"result.name",
        text:1,
        image:1,
        inserted_at:1,
        likesCount:1,
        repliesCount:1,
      }}
    ]
    const postReplies = await repliesCollection.aggregate(pipeline).toArray();
    return res.status(200).json({status:true,result:postReplies});
  } catch (err) {
    return res.status(500).json({status:false, error: err.message });
  }
};
const isLiked = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const postId = new ObjectId(String(req.params.id));
    const likesCollection = await Likes();
    const result=await likesCollection.findOne({postId:postId,userId:currentUserId});
    if(result) return res.status(200).json({answer:true});
    else{
      return res.status(200).json({status:true,answer:false});
    }
  } catch (err) {
    return res.status(500).json({status:false, error: err.message });
  }
};
const deleteReply=async(req,res)=>{
  try{
    const currentUserId=req.user._id;
    const {reply_id,post_id}=req.body;
    const replyId=new ObjectId(reply_id);
    const postId=new ObjectId(post_id);
    const repliesCollection=await Replies();
    const verifyreply=await repliesCollection.findOne({_id:replyId,postId:postId,userId:currentUserId});
    if(!verifyreply) return res.status(400).json({error:"Invalid Request"});
    await repliesCollection.deleteOne({_id:replyId});
    const postsCollection=await Posts();
    await postsCollection.updateOne({_id:postId},{$inc:{
      repliesCount:-1,
    }});
    return res.status(200).json({status:true,message:"Reply Deleted"});
  }
  catch(err)
  {
    return res.status(500).json({status:false, error: err.message });
    
  }
}
const LikeReply=async(req,res)=>{
  try{
    let {replyId}=req.body
    replyId=new ObjectId(String(replyId));
    const userId=req.user._id;
    const likesCollection=await Likes();
    const repliesCollection=await Replies();
    const isValid=await repliesCollection.findOne({_id:replyId});
    if(!isValid) return res.status(400).json({status:false,message:"Invalid Reply Id"});
    const isLiked=await likesCollection.findOne({replyId:replyId,userId:userId});
    if(isLiked){
      await likesCollection.deleteOne({replyId:replyId,userId:userId});
      await repliesCollection.updateOne({_id:replyId},{$inc:{
        likesCount:-1
      }});

    }
    else{
      await likesCollection.insertOne({replyId:replyId,userId:userId});
      await repliesCollection.updateOne({_id:replyId},{$inc:{
        likesCount:1
      }});

    }
    return res.status(200).json({status:true,message:"Likes/Unlikes Successfull"});


  }
  catch(err){
    return res.status(500).json({status:false, error: err.message });

  }
}
const isLikedReply=async(req,res)=>{
  try{
    const currentUser=req.user._id;
    let replyId=String(req.params.id);
    replyId=new ObjectId(replyId);
    const likesCollection=await Likes();
    const isLiked=await likesCollection.findOne({userId:currentUser,replyId:replyId});
    if(isLiked){
      return res.status(200).json({status:true,answer:true});
    }
    else{
      return res.status(200).json({status:true,answer:false});
    }
  }
  catch(err){
    return res.status(500).json({status:false, error: err.message });
  }

}
export {
  getPost,
  getFeedPosts,
  createPost,
  likePost,
  replyToPost,
  deletePost,
  getUserPosts,
  getLikes,
  getReplies,
  isLiked,
  deleteReply,
  LikeReply,
  isLikedReply
};
