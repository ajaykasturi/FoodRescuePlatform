const cron = require("node-cron");
const { pool } = require("../config/db");

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Cron: Checking for expired food listings...");
  try {
    //check for active listings and if they expire set status as expired
    const result = await pool.query(
      `
      UPDATE food_listings
      SET status = 'expired', updated_at = NOW()
      WHERE expiry_at < NOW() AND status = 'active';    
      `
    );
    console.log(`Cron: Marked ${result.rowCount} listings as expired.`);
  } catch (error) {
    console.error("Cron Expiry Error:", error);
  }
});
