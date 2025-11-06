import cron from "node-cron";
import { getDb } from "../ConnectDB/connectToDb.js";
import moment from "moment";
cron.schedule("*/30 * * * *", async () => {
  try {
    const db = getDb();
    const currTime = moment().format("YY-MM-DD HH:mm:ss");
    db.collection("verifyEmailOtp").deleteMany({ expirationTime: { $lte: currTime } });
     db.collection("verifyResetPasswordOtp").deleteMany({ expirationTime: { $lte: currTime } });
    console.log("Cron job successfull");
  } catch (err) {
    logger.error("otpDeleteJob:"+err.message);
  }
});
