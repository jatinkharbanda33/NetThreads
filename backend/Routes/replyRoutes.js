import express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import { createReply, getAllReplies, getReplies, getReply, isLiked, likeReply} from "../Controllers/replyController.js";
const router=express.Router();

router.post("/get/:id",protectRoute,getReply);
router.post("/create",protectRoute,createReply);
router.post("/like/:id",protectRoute,likeReply);
router.post("/get/replies",protectRoute,getReplies);
router.get("/get/isLiked/:id",protectRoute,isLiked);
router.post("/replies",protectRoute,getAllReplies);
export default router;