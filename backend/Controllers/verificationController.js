import moment from "moment";
import { getDb } from "../ConnectDB/connectToDb.js";
import otpGenerator from "otp-generator";
import validator from "validator";
import { mailSender } from "../utils/mailSender.js";
import {
  emailVerificationOtpMailBody,
  resetPasswordOtpMailBody,
} from "../helper/mailBody.js";
const verifyEmail = async (req, res) => {
  try {
    const db = getDb();
    const { email } = req.body;
    const currentUserId = req.user._id;
    if (isAlreadyVerified(currentUserId) == true)
      return res
        .status(400)
        .json({ error: "User already verified", status: false });
    console.log(email);
    if (!email || !validator.isEmail(email))
      return res
        .status(400)
        .json({ error: "Invalid email address", status: false });
    const isPresent = await db.collection("Users").findOne({
      email: email,
    });
    if (isPresent && isPresent != null) {
      return res
        .status(401)
        .json({ error: "Email already linked with an account", status: false });
    }
    let newOtpToSend = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let isOtpPresent = await db
      .collection("verifyEmailOtp")
      .findOne({ otp: newOtpToSend });
    while (isOtpPresent && isOtpPresent != null) {
      newOtpToSend = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      isOtpPresent = await db
        .collection("verifyEmailOtp")
        .findOne({ otp: newOtpToSend });
    }
    let anyPendingOtp = await db
      .collection("verifyEmailOtp")
      .findOne({ email: email });
    if (anyPendingOtp && anyPendingOtp != null)
      await db
        .collection("verifyEmailOtp")
        .deleteOne({ _id: anyPendingOtp._id });
    let mailBody =
      "NetThreads - One Time Password(OTP) for email verification request";
    let mailSubject = emailVerificationOtpMailBody(newOtpToSend);
    ("NetThreads- Your One-Time Password (OTP) for Email Verification");
    let { mailStatus } = await mailSender(email, mailSubject, mailBody);
    if (mailStatus == true) {
      const insertedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const expirationTime = moment()
        .add(3, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      await db.collection("verifyEmailOtp").insertOne({
        otp: newOtpToSend,
        email: email,
        insertedAt: insertedAt,
        expirationTime: expirationTime,
      });
      return res.status(200).json({ message: "Otp Sent", status: true });
    }
    return res.status(400).json({ message: "Retry", status: false });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
const verifyEmailOtp = async (req, res) => {
  try {
    const db = getDb();
    let { otp, email } = req.body;
    if (!email || !validator.isEmail(email))
      return res
        .status(400)
        .json({ error: "Invalid email address", status: false });
    const currentUserId = req.user._id;
    if (isAlreadyVerified(currentUserId) == true)
      return res
        .status(400)
        .json({ error: "User already verified", status: false });
    otp = String(otp);
    console.log(otp);
    let isOtpRecord = await db
      .collection("verifyEmailOtp")
      .findOne({ otp: otp, email: email });
    console.log(isOtpRecord);
    if (isOtpRecord && isOtpRecord != null) {
      let now = moment();
      if (now.isBefore(isOtpRecord.expirationTime)) {
        await db
          .collection("verifyEmailOtp")
          .deleteOne({ _id: isOtpRecord._id });
        await db
          .collection("Users")
          .findOneAndUpdate(
            { _id: currentUserId },
            { $set: { email: email, verified: true } }
          );
        return res
          .status(200)
          .json({ message: "Email successfully linked", status: true });
      } else {
        return res.status(400).json({ message: "Time Expired", status: false });
      }
    } else {
      return res.status(400).json({ error: "Invalid Otp", status: false });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
const isAlreadyVerified = async (currentUserId) => {
  try {
    const db = getDb();
    const isVerified = await db
      .collection("Users")
      .findOne({ _id: currentUserId, verified: true });
    if (isVerified && isVerified != null && isVerified?._id != null)
      return true;
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const db = getDb();
    let isUserPresent = await db
      .collection("Users")
      .findOne({ email: email, verified: true });
    if (!isUserPresent || isUserPresent == null)
      return res.status(400).json({
        status: false,
        error: "No active accounts linked with provided email",
      });
    let newOtpToSend = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let isOtpPresent = await db
      .collection("verifyResetPasswordOtp")
      .findOne({ otp: newOtpToSend });
    while (isOtpPresent && isOtpPresent != null) {
      newOtpToSend = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      isOtpPresent = await db
        .collection("verifyResetPasswordOtp")
        .findOne({ otp: newOtpToSend });
    }
    let anyPendingOtp = await db
      .collection("verifyResetPasswordOtp")
      .findOne({ email: email });
    if (anyPendingOtp && anyPendingOtp != null)
      await db
        .collection("verifyResetPasswordOtp")
        .deleteOne({ _id: anyPendingOtp._id });
    let mailSubject =
      "NetThreads - One Time Password(OTP) for password reset request";
    let mailBody = resetPasswordOtpMailBody(newOtpToSend);
    ("NetThreads- Your One-Time Password (OTP) for Email Verification");
    let { mailStatus } = await mailSender(email, mailSubject, mailBody);
    if (mailStatus == true) {
      const expirationTime = moment()
        .add(3, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      await db.collection("verifyResetPasswordOtp").insertOne({
        otp: newOtpToSend,
        email: email,
        insertedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        expirationTime: expirationTime
      });
      return res.status(200).json({ message: "Otp Sent", status: true });
    }
    return res.status(400).json({ message: "Retry", status: false });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
const resetPasswordOtpVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const db = getDb();
    let isOtpRecord = await db
      .collection("verifyResetPasswordOtp")
      .findOne({ email: email, otp: otp });
    if (!isOtpRecord || isOtpRecord == null)
      return res.status(400).json({ status: 400, error: "Invalid Otp" });
    let now = moment();
    if (now.isBefore(isOtpRecord.expirationTime)) {
      await db
        .collection("verifyResetPasswordOtp")
        .deleteOne({ _id: isOtpRecord._id });
      const insertedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const expirationTime = moment()
        .add(5, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      await db.collection("resetPasswordWindow").insertOne({
        email: email,
        insertedAt: insertedAt,
        expirationTime: expirationTime,
      });
      return res.status(200).json({ message: "Otp verified", status: true });
    } else {
      return res.status(400).json({ message: "Time Expired", status: false });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};
export {
  verifyEmail,
  verifyEmailOtp,
  resetPassword,
  resetPasswordOtpVerification,
};
/* 
const verifyEmailTest = async () => {
  try {
    let newOtpToSend = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let mailBody=otpMailBody(newOtpToSend);
    let mailSubject =
      "NetThreads- Your One-Time Password (OTP) for Email Verification";
    let { mailStatus } = await mailSender("ashourie269@gmail.com", mailSubject, mailBody);
    console.log(mailStatus);
  } catch (err) {
    console.log(err.message,err.stack);
  }
}; */
