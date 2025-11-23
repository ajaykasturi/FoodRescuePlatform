const { pool } = require("../config/db");

const createUsersTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,                           -- Unique user identifier
        email VARCHAR(255) UNIQUE NOT NULL,             -- Email address
        password TEXT NOT NULL,                          -- Encrypted password
        full_name VARCHAR(255) NOT NULL,                -- Full name
        profile_picture_url TEXT,                        -- Profile picture URL
        phone_number VARCHAR(20),                        -- Optional phone number
        address TEXT,                                   -- Physical address
        latitude NUMERIC(9,6),                           -- Latitude
        longitude NUMERIC(9,6),                          -- Longitude
        user_role VARCHAR(20) NOT NULL,               -- Consumer, Vendor, Administrator
        account_status VARCHAR(20) NOT NULL DEFAULT 'unverified', -- Active, Blocked, Unverified
        email_verified BOOLEAN DEFAULT FALSE,           -- Email verification
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Account creation timestamp
        last_login TIMESTAMP,                            -- Last successful login
        terms_accepted BOOLEAN,                     -- Timestamp when T&C accepted
        failed_login_attempts INT DEFAULT 0,             -- Number of failed login attempts
        locked_until TIMESTAMP                            -- Account locked until timestamp
      );
    `;

    await pool.query(query);
    console.log("Users table created successfully (or already exists).");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

// Execute the table creation
createUsersTable()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
  });
