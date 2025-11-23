const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY,
  },
});
async function sendMail(body) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Food Rescue Platform <ajayreigns0@gmail.com>`,
    to: body.email,
    subject: body.subject,
    text: `Your OTP: ${body.otp}`,
    html: `<div>
        <strong>Your OTP: </strong>
        <span>${body.otp}. It will expire in ${body.otpExpiryMinutes} minutes</span>
        <br/><br/>
        <pre>Food Rescue Platform</pre>
        </div>`,
  });
  return info;
}
module.exports = { sendMail };
