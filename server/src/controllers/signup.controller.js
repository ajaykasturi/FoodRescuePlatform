const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const generateOTP = require("../utils/generateOTP");
const { sendMail } = require("../utils/sendMail");
const handleConsumerRegister = async (req, res) => {
  try {
    const {
      email,
      fullName,
      phoneNumber,
      address,
      latitude,
      longitude,
      termsAccepted,
      password,
      confirmPassword,
    } = req.body;
    //check if the passwords match
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }
    //check if the terms are accepted by consumer or not
    if (!termsAccepted) {
      res.status(400).json({
        success: false,
        message: "Terms must be accepted",
      });
      return;
    }
    //check if the email already exists in the database
    const existing = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (existing.rows.length > 0) {
      const consumerRecord = existing.rows[0];
      if (!consumerRecord.email_verified) {
        //if the user exists but not verified then it will delete the existing user details so user can continue with new details
        await pool.query("DELETE FROM users WHERE email = $1", [email]);
      } else {
        //it returns 409 status code stating that user already exists and verified in the system
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //insert query
    const insertUserQuery = `
      INSERT INTO users 
        (email, full_name, phone_number, address, latitude, longitude, terms_accepted, password, user_role)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 'consumer')
      RETURNING *;`;

    const userValues = [
      email,
      fullName,
      phoneNumber,
      address,
      latitude,
      longitude,
      termsAccepted,
      hashedPassword,
    ];
    //insert into the database with cosntructed query and values
    await pool.query(insertUserQuery, userValues);

    //This is for testing whether record is created in the database or not
    //res.status(201).json({ success: true, result });

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
    //don't reveal the error message, as it keep system at risk
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again",
      //   error, //this is for testing purpose comment after testing bcz this exposes secrets, SQL structure, internal logic.
    });
  }
};

module.exports = { handleConsumerRegister };
