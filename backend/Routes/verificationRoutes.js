import express from "express";
import protectRoute from "../Middlewares/protectRoute.js";
import { verifyEmail,verifyEmailOtp,resetPassword,resetPasswordOtpVerification} from "../Controllers/verificationController.js";
const router=express.Router();
router.post("/email",protectRoute,verifyEmail);
router.post("/otp",protectRoute,verifyEmailOtp);
router.post("/forgot/password",resetPassword);
router.post("/reset/password",resetPasswordOtpVerification)
export default router;