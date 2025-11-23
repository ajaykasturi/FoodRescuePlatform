const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});

// Function to connect to DB with retry logic
const connectDB = async () => {
  const maxRetries = 5;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected successfully");
      client.release();
      return; // stop after successful connection
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err.message);
      await new Promise((res) => setTimeout(res, 1000)); // wait 1s before retry
    }
  }

  console.error("Unable to connect to PostgreSQL after retries. Exiting...");
  process.exit(1);
};

module.exports = { pool, connectDB };
