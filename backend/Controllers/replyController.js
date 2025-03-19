import { ObjectId } from "mongodb";
import { putObjectinS3 } from "../utils/s3bucket.js";
import moment from "moment";
import { getDb } from "../ConnectDB/connectToDb.js";
import logger from "../utils/logger.js";

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
          postedBy:"$postedByUser._id",
          name: "$postedByUser.name",
          username: "$postedByUser.username",
          profilepicture: "$postedByUser.profilepicture",
          postedByVerifiedUser: "$postedByUser.verified",
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
        parent_reply_id: parent_id,
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
        parent_reply_id: parent_id,
        
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
    console.log("replyController.js: " + err.message);
    logger.error("replyController.js: " + err.message);
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
    console.log("Hey we have received a req");
    let { parent_reply_id, lastFetchedId } = req.body;
    const db = getDb();
    const pipeline = [];
    const matchStage = { $match: {} };
    if (lastFetchedId != null) {
      matchStage.$match._id = { $gt: new ObjectId(lastFetchedId) };
    }
    if (parent_reply_id) {
      matchStage.$match.parent_reply_id = new ObjectId(parent_reply_id);
    }

    pipeline.push(matchStage);

    pipeline.push({
      $sort: {
        _id: 1,
      },
    });

    pipeline.push({ $limit: 12 });

    pipeline.push({
      $lookup: {
        from: "Users",
        localField: "postedBy",
        foreignField: "_id",
        as: "result",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$result",
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        username: "$result.username",
        profile_picture: "$result.profilepicture",
        name: "$result.name",
        text: 1,
        image: 1,
        inserted_at: 1,
        likesCount: 1,
        repliesCount: 1,
      },
    });

    const replies = await db.collection("Replies").aggregate(pipeline).toArray();
    return res.status(200).json({ status: true, data: replies });
  } catch (err) {
    console.log("Oops an error occured",err.message,err.stack);
    console.error("Error in getReplies:", err.message, err.stack);
    return res.status(500).json({ error: err.message, status: false });
  }
};

const isLiked=async(req,res)=>{
  try{
    const id=req.params.id;
     const currentUser = req.user._id;
     const db=getDb();
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
const getAllReplies=async(req,res)=>{
  try {
    let { parent_reply_id, lastFetchedId } = req.body;
    const db = getDb();
    const pipeline = [];
    const matchStage = { $match: {} };
    if (lastFetchedId != null) {
      matchStage.$match._id = { $gt: new ObjectId(lastFetchedId) };
    }
    if (parent_reply_id) {
      matchStage.$match.parent_reply_id = new ObjectId(parent_reply_id);
    }

    pipeline.push(matchStage);

    pipeline.push({
      $sort: {
        _id: 1,
      },
    });

    pipeline.push({ $limit: 12 });

    pipeline.push({
      $lookup: {
        from: "Users",
        localField: "postedBy",
        foreignField: "_id",
        as: "result",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$result",
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        username: "$result.username",
        postedBy:"$result._id",
        profilepicture: "$result.profilepicture",
        name: "$result.name",
        text: 1,
        image: 1,
        inserted_at: 1,
        likesCount: 1,
        repliesCount: 1,
        postedByVerifiedUser: "$result.verified"
      },
    });

    const replies = await db.collection("Replies").aggregate(pipeline).toArray();
    return res.status(200).json({ status: true, data: replies });
  } catch (err) {
    
    return res.status(500).json({ error: err.message, status: false });
  }

}

export {getReply,createReply,likeReply,getReplies,isLiked,getAllReplies}