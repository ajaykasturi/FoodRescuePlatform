const { pool } = require("../../config/db");

const checkOutOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const consumerId = req.userId;
    const { listingId } = req.body;
    const bags = 1;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing",
      });
    }

    await client.query("BEGIN");

    const previouslyOrdered = await client.query(
      `
      SELECT id FROM orders
      WHERE consumer_id = $1 AND listing_id = $2;`,
      [consumerId, listingId]
    );

    if (previouslyOrdered.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "You have already ordered this item.",
      });
    }
    //get listing details with row lock
    const listingResult = await client.query(
      `
      SELECT 
        l.id,
        l.vendor_id,
        l.bags_available,
        l.discounted_price,
        l.food_details,
        l.pickup_address,
        l.category,
        b.legal_name AS business_name
      FROM food_listings l
      JOIN business_info b ON b.user_id = l.vendor_id
      WHERE l.id = $1 AND l.status = 'active' AND (l.expiry_at AT TIME ZONE 'America/Toronto') > (NOW() AT TIME ZONE 'America/Toronto')
      FOR UPDATE;
      `,
      [listingId]
    );

    if (listingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Listing not found or not active",
      });
    }

    const listing = listingResult.rows[0];

    //check bag availability
    if (listing.bags_available < bags) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Not enough bags available",
      });
    }

    const totalPrice = listing.discounted_price * bags;

    //insert order
    const orderResult = await client.query(
      `
      INSERT INTO orders 
        (consumer_id, vendor_id, listing_id, price, food_details, pickup_address, category, business_name, status)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 'placed')
      RETURNING *;
      `,
      [
        consumerId,
        listing.vendor_id,
        listingId,
        totalPrice,
        listing.food_details,
        listing.pickup_address,
        listing.category,
        listing.business_name,
      ]
    );

    //update listing bag count
    await client.query(
      `
      UPDATE food_listings
      SET bags_available = bags_available - $1,
          updated_at = NOW()
      WHERE id = $2;
      `,
      [bags, listingId]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: orderResult.rows[0],
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

const getConsumerOrders = async (req, res) => {
  try {
    const consumerId = req.userId;
    const result = await pool.query(
      `
      SELECT 
        id,
        price,
        food_details,
        pickup_address,
        category,
        business_name,
        status,
        created_at
      FROM orders
      WHERE consumer_id = $1
      ORDER BY created_at DESC;
      `,
      [consumerId]
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

const cancelOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const consumerId = req.userId;
    const orderId = req.params.id;

    await client.query("BEGIN");

    //fetch order
    const orderResult = await client.query(
      `
      SELECT * FROM orders
      WHERE id = $1 AND consumer_id = $2
      FOR UPDATE;
      `,
      [orderId, consumerId]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    if (order.status !== "placed") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Order already delivered or canceled",
      });
    }

    // return bag back to listing (if listing still exists)
    if (order.listing_id) {
      await client.query(
        `
        UPDATE food_listings
        SET bags_available = bags_available + 1
        WHERE id = $1;
        `,
        [order.listing_id]
      );
    }

    // update order status
    await client.query(
      `
      UPDATE orders
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1;
      `,
      [orderId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cancel order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel the order",
    });
  } finally {
    client.release();
  }
};

const rateOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const consumerId = req.userId;
    const {
      orderId,
      listingId,
      satisfaction,
      foodQuality,
      foodQuantity,
      feedback,
    } = req.body;
    // Basic validation
    if (!orderId || !satisfaction || !foodQuality || !foodQuantity) {
      return res.status(400).json({
        success: false,
        message: "Missing rating fields",
      });
    }
    // check if order exists and belongs to consumer
    const orderResult = await client.query(
      `
      SELECT id, consumer_id, vendor_id, status
      FROM orders
      WHERE id = $1;
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const order = orderResult.rows[0];
    // order must belong to consumer
    if (order.consumer_id !== consumerId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to rate this order",
      });
    }
    // order must be delivered
    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be rated",
      });
    }
    // check if order already has rating
    const existingRating = await client.query(
      `SELECT id FROM ratings WHERE order_id = $1`,
      [orderId]
    );
    if (existingRating.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Order already rated",
      });
    }
    // insert rating
    const insertResult = await client.query(
      `
      INSERT INTO ratings 
        (order_id, consumer_id, listing_id, vendor_id, satisfaction, food_quality, food_quantity, feedback)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [
        orderId,
        consumerId,
        listingId,
        order.vendor_id,
        satisfaction,
        foodQuality,
        foodQuantity,
        feedback || null,
      ]
    );

    return res.json({
      success: true,
      message: "Rating submitted successfully",
      rating: insertResult.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  } finally {
    client.release();
  }
};

module.exports = {
  checkOutOrder,
  getConsumerOrders,
  cancelOrder,
  rateOrder,
};
