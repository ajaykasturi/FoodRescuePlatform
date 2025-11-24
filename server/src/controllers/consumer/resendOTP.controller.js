const { pool } = require("../../config/db");
const generateOTP = require("../../utils/generateOTP");
const { sendMail } = require("../../utils/sendMail");
const handleResendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    //get the record of user if it exists in the otp table
    const existingUserOtp = await pool.query(
      `SELECT resend_count, lock_expires_at 
        FROM otp_verification 
        WHERE email = $1;`,
      [email]
    );
    //if user otp record exists
    if (existingUserOtp.rows.length > 0) {
      const { resend_count, lock_expires_at } = existingUserOtp.rows[0];
      //Check if user is locked
      if (lock_expires_at && new Date(lock_expires_at) > new Date()) {
        return res.status(429).json({
          message: "Too many attempts. You are locked. Try again later.",
        });
      }
      //if User exceeds resend limit then lock for 20 mins
      if (resend_count >= 5) {
        const lockTime = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes lock
        await pool.query(
          `UPDATE otp_verification 
             SET lock_expires_at = $1, resend_count = 0
             WHERE email = $2;`,
          [lockTime, email]
        );
        return res.status(429).json({
          message: "Too many attempts. You are locked for 20 minutes.",
        });
      }
    }
    //Generate OTP
    const otpCode = generateOTP();
    //otp expires in 3 minutes
    const otpExpiryMinutes = 3;
    const otpExpiry = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
    //contruct query and values
    const upsertOtpQuery = `INSERT INTO otp_verification 
        (email, otp_code, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET
        otp_code = EXCLUDED.otp_code,
        created_at = NOW(),
        expires_at = EXCLUDED.expires_at,
        resend_count = otp_verification.resend_count + 1
        RETURNING *;`;
    const otpValues = [email, otpCode, otpExpiry];
    //insert otp data into database
    await pool.query(upsertOtpQuery, otpValues);
    // Send OTP to user's email
    const mailStatus = await sendMail({
      email: email,
      otp: otpCode,
      subject: "Verification OTP for Your Account Creation",
      otpExpiryMinutes,
    });
    return res.status(201).json({
      success: true,
      email: email,
      otpExpiry: otpExpiry,
      otpExpiryMinutes,
      message: "OTP sent successfully. Please check your email.",
      //   mailStatus, //uncomment and use only for testing the api
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, try again...",
    });
  }
};

module.exports = { handleResendOTP };
