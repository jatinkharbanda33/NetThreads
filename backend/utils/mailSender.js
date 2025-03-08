import config from '../Config/config.js';
import nodemailer from "nodemailer";
const mailSender = async (receiverMail,subject,body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true,
      auth: {
        user: config.GMAIL_ADDRESS,
        pass: config.GMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: config.GMAIL_ADDRESS,
      to: receiverMail, 
      subject: subject, 
      html:body 
    });
    if(info?.accepted?.length>0) return {mailStatus:true};
    return {mailStatus:false};
  } catch (err) {
    console.error(err);
  }
};

export {mailSender}
