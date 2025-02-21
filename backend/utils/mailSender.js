import nodemailer from "nodemailer";
const mailSender = async (receiverMail,subject,body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true,
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
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
