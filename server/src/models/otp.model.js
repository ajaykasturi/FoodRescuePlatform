const { pool } = require("../config/db");

const createOtpVerificationTable = async () => {
  try {
    // Create otp_verification table
    const query = `
      CREATE TABLE IF NOT EXISTS otp_verification (
        id SERIAL PRIMARY KEY,                            -- Unique OTP identifier
        email VARCHAR(255) UNIQUE NOT NULL,                      -- Recipient email
        otp_code CHAR(6) NOT NULL,                        -- 6-digit numeric OTP
        failed_attempts INT DEFAULT 0,                    -- Number of failed verification attempts
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Code creation timestamp
        expires_at TIMESTAMP NOT NULL,                    -- Code expiration timestamp
        is_used BOOLEAN DEFAULT FALSE,                    -- Whether OTP has been used
        resend_count INT DEFAULT 0,                       -- Number of times OTP was resent
        lock_expires_at TIMESTAMP                         -- OTP lock expiration timestamp
      );
    `;

    await pool.query(query);
    console.log(
      "OTP verification table created successfully (or already exists)."
    );
  } catch (err) {
    console.error("Error creating OTP verification table:", err);
  }
};

// Execute the table creation
createOtpVerificationTable()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
  });
