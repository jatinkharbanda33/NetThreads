import express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import {createPost, getPreviousPosts,getRecentPosts,getPost, likePost, replyToPost ,deletePost,getUserPosts,getLikes,getReplies, isLiked, deleteReply, LikeReply, isLikedReply} from "../Controllers/postController.js";
const router=express.Router();

router.post("/get/:id",protectRoute,getPost);
router.post("/feed/recent",protectRoute,getRecentPosts);
router.post("/feed/previous",protectRoute,getPreviousPosts);
router.post("/create",protectRoute,createPost);
router.post("/like/:query",protectRoute,likePost);
router.post("/reply/:id",protectRoute,replyToPost);
router.post("/delete/:id",protectRoute,deletePost);
router.post("/get/userposts/:id",protectRoute,getUserPosts);
router.post("/get/likes/:id",protectRoute,getLikes);
router.post("/get/replies/:id",protectRoute,getReplies);
router.post("/isliked/:id",protectRoute,isLiked);
router.post("/delete/reply",protectRoute,deleteReply);
router.post("/like/reply",protectRoute,LikeReply);
router.post("/isliked/reply/:id",protectRoute,isLikedReply);


export default router;