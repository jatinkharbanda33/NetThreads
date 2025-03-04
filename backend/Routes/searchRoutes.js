import  express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import { atlasSearchByUsername, searchByUsername } from "../Controllers/searchController.js";
const router=express.Router();

//router.post("/users",protectRoute,searchByUsername);
router.get("/username",protectRoute,atlasSearchByUsername);

export default router;