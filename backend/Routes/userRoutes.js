import  express from "express";
import { loginUser, signupUser ,logoutUser,getUserProfile,getUserByToken, updateProfilePicture, updateUserDetails, refreshToken} from "../Controllers/userController.js";
import protectRoute from "../Middlewares/protectRoute.js";

const router=express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.get("/profile/:id",protectRoute,getUserProfile);
router.post("/logout",protectRoute,logoutUser);
router.post("/getuser/token",protectRoute,getUserByToken);
router.post("/update/profilepicture",protectRoute,updateProfilePicture);
router.post("/update/userDetails",protectRoute,updateUserDetails);
router.get("/refresh/token",refreshToken);


export default router;