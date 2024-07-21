import { ObjectId } from "mongodb";
import { putObjectinS3 } from "../utils/s3bucket.js";
import moment from "moment";
import { getDb } from "../ConnectDB/connectToDb.js";
const getPost = async (req, res) => {
  try {
    const db = getDb();
    const currentUserId = req.user._id;
    const postId = new ObjectId(String(req.params.id));
    const pipeline = [
      {
        $match: {
          _id: postId,
        },
      },
      {
        $lookup: {
          from: "Likes",
          pipeline: [
            {
              $match: {
                postId: postId,
                userId: currentUserId,
              },
            },
          ],
          as: "result",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedByUser",
        },
      },
      {
        $unwind: {
          path: "$postedByUser",
        },
      },
      {
        $project: {
          text: 1,
          image: 1,
          _id: 1,
          result: 1,
          inserted_at: 1,
          likesCount: 1,
          repliesCount: 1,
          name: "$postedByUser.name",
          username: "$postedByUser.username",
          profilepicture: "$postedByUser.profilepicture",
        },
      },
    ];
    const result = await db.collection("Posts").aggregate(pipeline).toArray();
    if (!result || result.length == 0)
      return res.status(400).json({ status: false, error: "Invalid Id" });
    return res.status(200).json({ status: true, result: result[0] });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
const getRecentPosts = async (req, res) => {
  try {
    const prevFetchedId = req?.body?.prevFetchedId;
    const limit = 12;
    const db = getDb();
    const pipeline = [
      {
        $match: {
          _id: { $gt: new ObjectId(prevFetchedId) },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      { $limit: limit },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: "Users",
          localField: "postedBy",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          image: 1,
          likesCount: 1,
          inserted_at: 1,
          repliesCount: 1,
          postedBy: 1,
          username: "$result.username",
          profilepicture: "$result.profilepicture",
        },
      },
    ];

    const feedPosts = await db
      .collection("Posts")
      .aggregate(pipeline)
      .toArray();
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({status:false, error: 'Internal Server Error' });
  }
};
const getPreviousPosts = async (req, res) => {
  try {
    const db = getDb();
    const lastFetchedPostId = req?.body?.lastFetchedPostId;
    const matchFields = { $match: {} };
    if (lastFetchedPostId != null) {
      matchFields.$match._id = { $lt: new ObjectId(lastFetchedPostId) };
    } else {
      matchFields.$match.inserted_at = {
        $lte: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
    }
    const limit = 12;
    const pipeline = [
      matchFields,
      {
        $sort: {
          _id: -1,
        },
      },
      { $limit: limit },
      {
        $lookup: {
          from: "Users",
          localField: "postedBy",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          image: 1,
          likesCount: 1,
          inserted_at: 1,
          repliesCount: 1,
          postedBy: 1,
          username: "$result.username",
          profilepicture: "$result.profilepicture",
        },
      },
    ];

    const feedPosts = await db
      .collection("Posts")
      .aggregate(pipeline)
      .toArray();
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ status:false, error: 'Internal Server Error' });
  }
};

const createPost = async (req, res) => {
  try {
    const db = getDb();
    const { text, file_name, file_content_type } = req.body;
    const creatorId = req.user._id;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    if (!file_name || !file_content_type) {
      const newPost = await db.collection("Posts").insertOne({
        postedBy: creatorId,
        text: text,
        image: null,
        likesCount: 0,
        inserted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        repliesCount: 0,
      });
      return res
        .status(201)
        .json({ _id: newPost.insertedId, status: true, imageurl: null });
    } else {
      const { url, status, error, key } = await putObjectinS3(
        file_name,
        req.user.username,
        file_content_type,
        "post"
      );
      if (!status) return res.status(400).json({ status: false, error: error });
      await db.collection("Posts").updateOne(
        { date: currentDate },
        {
          $inc: { postCount: 1 },
        }
      );
      const newPost = await db.collection("Posts").insertOne({
        postedBy: creatorId,
        text: text,
        image: key,
        likesCount: 0,
        inserted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        repliesCount: 0,
      });
      return res
        .status(201)
        .json({
          _id: newPost.insertedId,
          status: true,
          url: url,
          imageurl: key,
        });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', status: false });
  }
};
const likePost = async (req, res) => {
  try {
    const db = getDb();
    const postId = new ObjectId(String(req.params.query));
    const currentUserId = req.user._id;
    const isLiked = await db.collection("Likes").findOne({
      postId: postId,
      userId: currentUserId,
    });
    if (isLiked) {
      await db.collection("Likes").deleteOne({
        postId: postId,
        userId: currentUserId,
      });
      await db
        .collection("Posts")
        .updateOne({ _id: postId }, { $inc: { likesCount: -1 } });
      return res.status(201).json({
        message: "Like Removed from Post Succesfully",
      });
    } else {
      await db.collection("Likes").insertOne({
        postId: postId,
        userId: currentUserId,
      });
      await db
        .collection("Posts")
        .updateOne({ _id: postId }, { $inc: { likesCount: 1 } });
      return res.status(201).json({
        message: "Liked the post Succesfully",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error',status:false });
  }
};
const replyToPost = async (req, res) => {
  try {
    const db = getDb();
    const postId = new ObjectId(String(req.params.id));
    const { text, image_name, image_content_type, postType } = req.body;
    const currentUserId = req.user._id;
    if (image_content_type && image_name) {
      const { url, status, error, key } = await putObjectinS3(
        image_name,
        req.user.username,
        image_content_type,
        "reply"
      );
      if (!status) return res.status(400).json({ status: false, error: error });
      await db.collection("Replies").insertOne({
        parent_id: postId,
        userId: currentUserId,
        text: text,
        image: url,
        inserted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        likesCount: 0,
        repliesCount: 0,
      });

      if (postType == "post") {
        await db
          .collection("Posts")
          .updateOne({ _id: postId }, { $set: { repliesCount: { $inc: 1 } } });
      } else {
        await db
          .collection("Replies")
          .updateOne({ _id: postId }, { $set: { repliesCount: { $inc: 1 } } });
      }
      return res
        .status(201)
        .json({
          status: true,
          message: "Reply added to the Post Successfully",
          url: url,
        });
    } else {
      await db.collection("Replies").insertOne({
        parent_id: postId,
        userId: currentUserId,
        text: text,
        inserted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        likesCount: 0,
        repliesCount: 0,
        image: null,
      });
      if (postType == "post") {
        await db
          .collection("Posts")
          .updateOne({ _id: postId }, { $set: { repliesCount: { $inc: 1 } } });
      } else {
        await db
          .collection("Replies")
          .updateOne({ _id: postId }, { $set: { repliesCount: { $inc: 1 } } });
      }

      return res
        .status(201)
        .json({
          status: true,
          message: "Reply added to the Post Successfully",
        });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const deletePost = async (req, res) => {
  try {
    const db = getDb();
    const postId = new ObjectId(req.params.id);
    const currentUserId = req.user._id;
    const post = await db.collection("Posts").findOne({
      _id: postId,
      postedBy: currentUserId,
    });
    if (!post) return res.status(400).json({ error: "Invalid Request" });
    await db.collection("Posts").deleteOne({ _id: postId });
    await db.collection("Likes").deleteMany({ postId: postId });
    await db.collection("Replies").deleteMany({ parent_id: postId });
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getUserPosts = async (req, res) => {
  try {
    const db = getDb();
    const currentUserId = new ObjectId(String(req.params.id));
    const page_count = req.body.page_count ? req.body.page_count : 0;
    const limit = 12;
    const skip = page_count * limit;
    const pipeline = [
      { $match: { postedBy: currentUserId } },
      { $sort: { inserted_at: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ];
    const userPosts = await db
      .collection("Posts")
      .aggregate(pipeline)
      .toArray();
    return res.status(200).json(userPosts);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getLikes = async (req, res) => {
  try {
    const db = getDb();
    const postId = new ObjectId(String(req.params.id));
    const page_count = req.body.page_count ? req.body.page_count : 0;
    const limit = 30;
    const skip = page_count * limit;
    const pipeline = [
      {
        $match: {
          postId: postId,
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          _id: 0,
          username: "$result.username",
          profile_picture: "$result.profilepicture",
          name: "$result.name",
          user_id: "$result._id",
        },
      },
    ];
    const postLikes = await db
      .collection("Likes")
      .aggregate(pipeline)
      .toArray();
    return res.status(200).json(postLikes);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getReplies = async (req, res) => {
  try {
    const db = getDb();
    const postId = new ObjectId(String(req.params.id));
    const page_count = req.body.page_count ? req.body.page_count : 0;
    
    const limit = 12;
    const skip = page_count * limit;
    const pipeline = [
      {
        $match: {
          parent_post_id: postId,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          __id: 1,
          username: "$result.username",
          profile_picture: "$result.profilepicture",
          name: "result.name",
          text: 1,
          image: 1,
          inserted_at: 1,
          likesCount: 1,
          repliesCount: 1,
        },
      },
    ];
    const postReplies = await db
      .collection("Posts")
      .aggregate(pipeline)
      .toArray();
    return res.status(200).json({ status: true, result: postReplies });
  } catch (err) {
    return res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
const isLiked = async (req, res) => {
  try {
    const db = getDb();
    const currentUserId = req.user._id;
    const postId = new ObjectId(String(req.params.id));
    const result = await db
      .collection("Likes")
      .findOne({ postId: postId, userId: currentUserId });
    if (result) return res.status(200).json({ answer: true });
    else {
      return res.status(200).json({ status: true, answer: false });
    }
  } catch (err) {
    return res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
const deleteReply = async (req, res) => {
  try {
    const db = getDb();
    const currentUserId = req.user._id;
    const { reply_id, post_id } = req.body;
    const replyId = new ObjectId(reply_id);
    const postId = new ObjectId(post_id);
    const verifyreply = await db
      .collection("Replies")
      .findOne({ _id: replyId, postId: postId, userId: currentUserId });
    if (!verifyreply) return res.status(400).json({ error: "Invalid Request" });
    await db.collection("Replies").deleteOne({ _id: replyId });
    await db.collection("Posts").updateOne(
      { _id: postId },
      {
        $inc: {
          repliesCount: -1,
        },
      }
    );
    return res.status(200).json({ status: true, message: "Reply Deleted" });
  } catch (err) {
    return res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
const LikeReply = async (req, res) => {
  try {
    const db=getDb();
    const replyId = new ObjectId(String(req?.body?.replyId));
    const userId = req.user._id;
    const isValid = await db.collection("Replies").findOne({ _id: replyId });
    if (!isValid)
      return res
        .status(400)
        .json({ status: false, message: "Invalid Reply Id" });
    const isLiked = await db
      .collection("Likes")
      .findOne({ replyId: replyId, userId: userId });
    if (isLiked) {
      await db
        .collection("Likes")
        .deleteOne({ replyId: replyId, userId: userId });
      await db.collection("Replies").updateOne(
        { _id: replyId },
        {
          $inc: {
            likesCount: -1,
          },
        }
      );
    } else {
      await db
        .collection("Likes")
        .insertOne({ replyId: replyId, userId: userId });
      await db.collection("Replies").updateOne(
        { _id: replyId },
        {
          $inc: {
            likesCount: 1,
          },
        }
      );
    }
    return res
      .status(200)
      .json({ status: true, message: "Likes/Unlikes Successfull" });
  } catch (err) {
    return res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
const isLikedReply = async (req, res) => {
  try {
    const db = getDb();
    const currentUser = req.user._id;
    const replyId = new ObjectId(String(req.params.id));
    const isLiked = await db
      .collection("Likes")
      .findOne({ userId: currentUser, replyId: replyId });
    if (isLiked) {
      return res.status(200).json({ status: true, answer: true });
    } else {
      return res.status(200).json({ status: true, answer: false });
    }
  } catch (err) {
    return res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
export {
  getPost,
  getPreviousPosts,
  getRecentPosts,
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
  isLikedReply,
};
