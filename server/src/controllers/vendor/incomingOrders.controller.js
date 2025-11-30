const { pool } = require("../../config/db");

const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.userId;
    const result = await pool.query(
      `
      SELECT
        o.id AS order_id,
        o.consumer_id,
        o.listing_id,
        o.price,
        o.food_details,
        o.pickup_address,
        o.category,
        o.business_name,
        o.status
      FROM orders o
      WHERE o.vendor_id = $1
      ORDER BY o.created_at DESC;
      `,
      [vendorId]
    );
    return res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  }
};
const markOrderAsDelivered = async (req, res) => {
  const client = await pool.connect();
  try {
    const vendorId = req.userId;
    const orderId = req.params.id;

    await client.query("BEGIN");
    //fetch order and lock
    const orderResult = await client.query(
      `
      SELECT id, vendor_id, status
      FROM orders
      WHERE id = $1
      FOR UPDATE;
      `,
      [orderId]
    );
    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const order = orderResult.rows[0];
    // ensure this order belongs to the logged-in vendor
    if (order.vendor_id !== vendorId) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this order",
      });
    }
    // only 'placed' orders can be delivered
    if (order.status !== "placed") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: `Order cannot be marked as delivered from status '${order.status}'`,
      });
    }
    // update order status to delivered
    const updateResult = await client.query(
      `
      UPDATE orders
      SET status = 'delivered',
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;
      `,
      [orderId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Order marked as delivered",
      order: updateResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  } finally {
    client.release();
  }
};
const getVendorRatings = async (req, res) => {
  try {
    const vendorId = req.userId;

    const result = await pool.query(
      `
      SELECT 
        r.id AS rating_id,
        r.order_id,
        r.consumer_id,
        r.satisfaction,
        r.food_quality,
        r.food_quantity,
        r.feedback,
        r.created_at,
        o.food_details,
        o.price,
        o.category,
        o.pickup_address,
        o.status AS order_status

      FROM ratings r
      LEFT JOIN orders o ON r.order_id = o.id
      WHERE r.vendor_id = $1
      ORDER BY r.created_at DESC;
      `,
      [vendorId]
    );
    // Fetch rating averages
    const summaryResult = await pool.query(
      `
      SELECT 
        ROUND(AVG(satisfaction), 2) AS avg_satisfaction,
        ROUND(AVG(food_quality), 2) AS avg_food_quality,
        ROUND(AVG(food_quantity), 2) AS avg_food_quantity,
        COUNT(*) AS total_ratings,
        COUNT(feedback) AS total_feedbacks
      FROM ratings
      WHERE vendor_id = $1;
      `,
      [vendorId]
    );

    const summary = summaryResult.rows[0];
    return res.json({
      success: true,
      count: result.rows.length,
      ratings: result.rows,
      summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
module.exports = { getVendorOrders, markOrderAsDelivered, getVendorRatings };
