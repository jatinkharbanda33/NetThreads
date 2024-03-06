import  express from "express";
import { loginUser, signupUser ,logoutUser,getUserProfile,followUnfollowUser,getUserByToken} from "../Controllers/userController.js";
import protectRoute from "../Middlewares/protectRoute.js";

const router=express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.get("/profile/:id",protectRoute,getUserProfile);
router.post("/logout",protectRoute,logoutUser);
router.post("/follow/:id",protectRoute,followUnfollowUser); 
router.post("/getuser/token",protectRoute,getUserByToken);
export default router;