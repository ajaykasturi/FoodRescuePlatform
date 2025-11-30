const cron = require("node-cron");
const { pool } = require("../config/db");

cron.schedule("* * * * *", async () => {
  console.log("Running pickup expiry cron...");

  try {
    //cancel orders where pickup window (3 hours) passed
    const expiredOrders = await pool.query(
      `
      UPDATE orders
      SET status = 'cancelled', updated_at = NOW()
      WHERE status = 'placed'
        AND created_at + INTERVAL '3 hours' < NOW()
      RETURNING id, listing_id;
      `
    );

    // return 1 bag back to listing for each cancelled order
    for (const order of expiredOrders.rows) {
      if (order.listing_id) {
        await pool.query(
          `
          UPDATE food_listings
          SET bags_available = bags_available + 1
          WHERE id = $1;
          `,
          [order.listing_id]
        );
      }
    }

    if (expiredOrders.rows.length > 0) {
      console.log(
        `Auto-cancelled ${expiredOrders.rows.length} unpicked orders`
      );
    }
  } catch (error) {
    console.error("cron job error:", error);
  }
});
