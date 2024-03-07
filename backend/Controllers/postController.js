import {
  Posts,
  Likes,
  Replies,
  Following,
  PostsMIS,
} from "../ConnectDB/getData.js";
import { ObjectId } from "mongodb";

const getPost = async (req, res) => {
  try {
    const postId = new ObjectId(String(req.params.query));
    const postCollection = await Posts();
    const post = await postCollection.findOne({ _id: postId });
    if (!post) return res.status(400).json({ error: "Invalid Post Id" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const { text, image } = req.body;
    const creatorId = req.user._id;
    const allHashTags = text.match(/#\w+/g) || [];
    const postCollection = await Posts();
    const postsMisCollection = await PostsMIS();
    const currentDate = new Date().setHours(0, 0, 0, 0);
     await postsMisCollection.updateOne(
      { date: currentDate },
      {
        $inc: { postCount: 1 },
        $addToSet: {
          hashtags: {
            $each: allHashTags.map((tag) => ({ name: tag, count: 1 })),
          },
        },
      },
      { upsert: true }
    );
    const newPost = await postCollection.insertOne({
      postedBy: creatorId,
      text: text,
      image: image,
      likesCount: 0,
      timestamps: new Date(),
      repliesCount: 0,
      hashTags: allHashTags,
    });
    return res.status(201).json({ _id: newPost.insertedId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
    const { text } = req.body;
    const currentUserId = req.user._id;
    const repliesCollection = await Replies();
    const postCollection = await Posts();
    await repliesCollection.insertOne({
      postId: postId,
      userId: currentUserId,
      text: text,
    });
    await postCollection.updateOne(
      { _id: postId },
      { $inc: { repliesCount: 1 } }
    );
    return res
      .status(201)
      .json({ message: "Reply added to the Post Successfully" });
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
        name:"result.name"
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
    const currentUserId = req.user._id;
    const postId = new ObjectId(String(req.params.id));
    const skip = req.query.skip || 0;
    const limit = req.query.skip || 12;
    const repliesCollection = await Replies();
    const pipeline = [
      { $match: { postId: postId } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      { $project: { userId: 1, text: 1 } },
    ];
    const postReplies = await repliesCollection.aggregate(pipeline).toArray();
    return res.status(200).json(postReplies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
      return res.status(200).json({answer:false});
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

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
};
