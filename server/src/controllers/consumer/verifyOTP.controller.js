const { pool } = require("../../config/db");

const handleConsumerVerifyOTP = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, otp } = req.body;
    // Check if OTP is exactly 6 digits (numbers only)
    if (!/^\d{6}$/.test(otp)) {
      return res
        .status(400)
        .json({ success: false, message: "OTP must be a 6-digit number" });
    }
    //check if the user exists in the db
    const result = await client.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // if email already verified
    if (user.email_verified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    //get otp info from database
    const otpResult = await client.query(
      "SELECT * FROM otp_verification WHERE email = $1;",
      [email]
    );
    const otpRecord = otpResult.rows[0];
    // Check if OTP record exists
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }
    // Check OTP expiration
    const now = new Date();
    const expiry = new Date(otpRecord.expires_at);
    if (now > expiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }
    // Check if locked
    if (
      otpRecord.lock_expires_at &&
      new Date() < new Date(otpRecord.lock_expires_at)
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Try again later.",
      });
    }
    // Check OTP match
    if (otpRecord.otp_code != otp) {
      //if otp mismatch occur, then do the following
      const attempts = otpRecord.failed_attempts + 1;
      // If attempts >= 5 then lock account for 20 minutes
      if (attempts >= 5) {
        const lockUntil = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes
        await client.query(
          `UPDATE otp_verification
            SET failed_attempts = $1, lock_expires_at = $2
            WHERE email = $3;`,
          [attempts, lockUntil, email]
        );
        return res.status(429).json({
          success: false,
          message: "Too many failed attempts. Locked for 20 minutes.",
        });
      }
      // Otherwise, just increment the failed_attempts counter
      await client.query(
        `UPDATE otp_verification
        SET failed_attempts = $1
        WHERE email = $2;`,
        [attempts, email]
      );
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    } else {
      // if OTP match occur then reset attempts, resend_count, lock_expires_at and mark isused as true
      await client.query("BEGIN");
      // Mark user as verified and active
      await client.query(
        `UPDATE users 
        SET email_verified = true, account_status = 'active'
        WHERE email = $1;`,
        [email]
      );
      //delete the otp record as it not used further
      await client.query(`DELETE FROM otp_verification WHERE email = $1;`, [
        email,
      ]);
      await client.query("COMMIT");
      //tbd: after successful email verification we can give login access to user
      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({
      success: false,
      message: "Something went wrong, try again...",
    });
  } finally {
    client.release();
  }
};

module.exports = { handleConsumerVerifyOTP };
