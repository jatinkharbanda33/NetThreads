
import dotenv from "dotenv";
dotenv.config();
import 'newrelic';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToMongo } from "./ConnectDB/connectToDb.js";
dotenv.config();
import userRoutes from "./Routes/userRoutes.js";
import postRoutes from "./Routes/postRoutes.js";
import searchRoutes from "./Routes/searchRoutes.js";
import replyRoutes from "./Routes/replyRoutes.js";
import verificationRoutes from "./Routes/verificationRoutes.js";
import "./crons/otpDeleteJob.js";
const initServer=async()=>{
  await connectToMongo();
  runServer();
}
const runServer = async () => {
  const app = express();
  const port = process.env.PORT || 5000;
  const allowedOrigins = ["https://main.d1xssg2i2irl98.amplifyapp.com", "*"];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      /* if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    } */
      return callback(null, true);
    },
    credentials: true,
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/reply", replyRoutes);
  app.use("/api/verify", verificationRoutes);
  
  app.get("/", async (req, res) => {
    try {
      return res.status(200).json({ status: true, message: "Server Started" });
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  });
  app.listen(port, () => console.log(`Listening on port ${port}`));
};
initServer();

