import express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import { createReply, getReplies, getReply, likeReply } from "../Controllers/replyController.js";
const router=express.Router();

router.post("/get/:id",protectRoute,getReply);
router.post("/create",protectRoute,createReply);
router.post("/like/:id",protectRoute,likeReply);
router.post('/get/replies/:id',protectRoute,getReplies);



export default router;