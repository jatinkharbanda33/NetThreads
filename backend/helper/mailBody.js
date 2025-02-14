const emailVerificationOtpMailBody=(newOtpToSend)=>{
    const mailBody=`
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 500px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
          <h2 style="color: #333;">🔐 Your One-Time Password (OTP) for Email Verification on NetThreads</h2>
          <p style="color: #555; font-size: 16px;">Use the OTP below to proceed with your verification:</p>
          <div style="font-size: 24px; font-weight: bold; color: #333; padding: 10px; background: #f8f9fa; display: inline-block; border-radius: 5px; margin: 15px 0;">
            ${newOtpToSend}
          </div>
          <p style="color: #555; font-size: 14px;">This OTP is valid for <strong>3 minutes</strong>. Please do not share it with anyone.</p>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">If you did not request this, please ignore this email or contact support.</p>
          <p style="color: #888; font-size: 12px;">&copy; 2025 NetThreads</p>
        </div>
      </body>
    </html>`;
    return mailBody
}
const resetPasswordOtpMailBody = (newOtpToSend) => {
  const mailBody = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <div style="max-width: 500px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #333;">🔒 Password Reset Request for your NetThreads account</h2>
        <p style="color: #555; font-size: 16px;">Use the OTP below to reset your password:</p>
        <div style="font-size: 24px; font-weight: bold; color: #333; padding: 10px; background: #f8f9fa; display: inline-block; border-radius: 5px; margin: 15px 0;">
          ${newOtpToSend}
        </div>
        <p style="color: #555; font-size: 14px;">This OTP is valid for <strong>3 minutes</strong>. Please do not share it with anyone.</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">If you did not request a password reset, please ignore this email or contact support immediately.</p>
        <p style="color: #888; font-size: 12px;">&copy; 2025 NetThreads</p>
      </div>
    </body>
  </html>`;
  return mailBody;
};

export { resetPasswordOtpMailBody, emailVerificationOtpMailBody };