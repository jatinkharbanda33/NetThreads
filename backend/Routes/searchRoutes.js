import  express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import { searchByUsername } from "../Controllers/searchController.js";
const router=express.Router();

router.post("/users",protectRoute,searchByUsername);

export default router;