import express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import {createPost, getPreviousPosts,getRecentPosts,getPost, likePost, replyToPost ,deletePost,getUserPosts,getLikes,getReplies, isLiked, deleteReply, LikeReply, isLikedReply} from "../Controllers/postController.js";
const router=express.Router();

router.post("/getpost/:id",protectRoute,getPost);
router.post("/feedposts/recent",protectRoute,getRecentPosts);
router.post("/feedposts/previous",protectRoute,getPreviousPosts);
router.post("/createpost",protectRoute,createPost);
router.post("/likepost/:query",protectRoute,likePost);
router.post("/replytopost/:id",protectRoute,replyToPost);
router.post("/deletepost/:id",protectRoute,deletePost);
router.post("/getuserposts/:id",protectRoute,getUserPosts);
router.post("/getlikes/:id",protectRoute,getLikes);
router.post("/getreplies/:id",protectRoute,getReplies);
router.post("/isliked/:id",protectRoute,isLiked);
router.post("/deleteReply",protectRoute,deleteReply);
router.post("/likereply",protectRoute,LikeReply);
router.post("/isliked/reply/:id",protectRoute,isLikedReply);


export default router;