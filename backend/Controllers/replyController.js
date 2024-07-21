import { ObjectId } from "mongodb";
import { putObjectinS3 } from "../utils/s3bucket.js";
import moment from "moment";
import { getDb } from "../ConnectDB/connectToDb.js";

const getReply = async (req, res) => {
  try {
    const db = getDb();
    const currentUserId = req.user._id;
    const replyId = new ObjectId(String(req.params.id));
    const pipeline = [
      {
        $match: {
          _id: replyId,
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
          inserted_at: 1,
          likesCount: 1,
          repliesCount: 1,
          name: "$postedByUser.name",
          username: "$postedByUser.username",
          profilepicture: "$postedByUser.profilepicture",
        },
      },
    ];
    const result = await db.collection("Replies").aggregate(pipeline).toArray();
    if (!result || result.length == 0)
      return res.status(400).json({ status: false, error: "Invalid Id" });
    return res.status(200).json({ status: true, result: result[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};
const createReply = async (req, res) => {
  try {
    const db = getDb();
    const {
      text,
      file_name,
      file_content_type,
      parent_reply_id,
      nesting_level,
    } = req.body;
    const parent_id = new ObjectId(parent_reply_id);
    const creatorId = req.user._id;
    if (!file_name || !file_content_type) {
      const newReply = await db.collection("Replies").insertOne({
        postedBy: creatorId,
        text: text,
        image: null,
        likesCount: 0,
        inserted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        repliesCount: 0,
        parent_reply_id: parent_reply_id,
      });
      if (nesting_level == 1) {
        await db.collection("Posts").findOneAndUpdate(
          { _id: parent_id },
          {
              $inc: { repliesCount: 1 },
          }
        );
      } else {
        await db.collection("Replies").findOneAndUpdate(
          { _id: parent_id },
          {
              $inc: { repliesCount: 1 },
          }
        );
      }
      return res
        .status(201)
        .json({ _id: newReply.insertedId, status: true, imageurl: null });
    } else {
      const { url, status, error, key } = await putObjectinS3(
        file_name,
        req.user.username,
        file_content_type,
        "reply"
      );
      if (!status) return res.status(400).json({ status: false, error: error });
      const newReply = await db.collection("Replies").insertOne({
        postedBy: creatorId,
        text: text,
        image: key,
        likesCount: 0,
        inserted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        repliesCount: 0,
      });
      if (nesting_level == 1) {
        await db.collection("Posts").findOneAndUpdate(
          { _id: parent_id },
          {
              $inc: { repliesCount: 1 },
          }
        );
      } else {
        await db.collection("Replies").findOneAndUpdate(
          { _id: parent_id },
          {
         
              $inc: { repliesCount: 1 },
          }
        );
      }
      return res.status(201).json({
        _id: newReply.insertedId,
        status: true,
        url: url,
        imageurl: key,
      });
    }
  } catch (err) {
    console.log(err.message,err.stack);
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
const likeReply = async (req, res) => {
  try {
    const db = getDb();
    const replyId = new ObjectId(req.params?.id);
    const currentUser = req.user._id;
    const alreadyLiked = await db
      .collection("Likes")
      .findOne({ replyId: replyId, userId: currentUser });
    if (alreadyLiked) {
      await db
        .collection("Replies")
        .findOneAndUpdate(
          { _id: replyId },
          { $inc: { likesCount: -1 }  }
        );
      await db.collection("Likes").deleteOne({ _id: alreadyLiked._id });
      return res.status(201).json({ status: true, message: "Like removed" });
    } else {
      await db
        .collection("Replies")
        .findOneAndUpdate(
          { _id: replyId },
          { $inc: { likesCount: 1 } }
        );
      await db
        .collection("Likes")
        .insertOne({ replyId: replyId, userId: currentUser });
      return res.status(201).json({ status: true, message: "Liked" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
const getReplies = async (req, res) => {
  try {
    let { parent_reply_id, lastFetchedId } = req.body;
    if (!lastFetchedId) {
      lastFetchedId = 0;
    }
    parent_reply_id = new ObjectId(parent_reply_id);
    lastFetchedId = new ObjectId(lastFetchedId);
    const db = getDb();
    const pipeline = [
      {
        $match: {
          parent_reply_id: parent_reply_id,
          _id: { $gt: lastFetchedId },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      { $limit: 12 },
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
    const replies = await db
      .collection("Replies")
      .aggregate(pipeline)
      .toArray();
    return res.status(200).json({ status: true, data: replies });
  } catch (err) {
    console.log(err.message,err.stack);
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
const isLiked=async(req,res)=>{
  try{
    const id=req.params.id;
     const currentUser = req.user._id;
    const isLiked=db.collection('Likes').findOne({replyId:new ObjectId(id),userId:currentUser});
    if(isLiked) return res.status(200).json({status:true,answer:true})
      return res.status(200).json({status:true,answer:true})

  }
  catch(err){
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });

  }
}

export {getReply,createReply,likeReply,getReplies,isLiked}