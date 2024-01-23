import express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import {createPost, getFeedPosts,getPost, likePost, replyToPost ,deletePost,getUserPosts,getLikes,getReplies} from "../Controllers/postController.js";
const router=express.Router();

router.get("/getpost/:query",getPost);
router.post("/feedposts",protectRoute,getFeedPosts);
router.post("/createpost",protectRoute,createPost);
router.post("/likepost/:query",protectRoute,likePost);
router.post("/replytopost/:id",protectRoute,replyToPost);
router.post("/deletepost/:id",protectRoute,deletePost);
router.get("/getuserposts",protectRoute,getUserPosts);
router.get("/getlikes/:id",protectRoute,getLikes);
router.get("/getreplies/:id",protectRoute,getReplies);

export default router;