const { pool } = require("../../config/db");
const addFoodListing = async (req, res) => {
  try {
    const {
      food_details,
      actual_price,
      discounted_price,
      bags_available,
      category,
      special_instructions,
      pickup_address,
      show_brand,
      best_before,
      expiry_at,
    } = req.body;

    const expiryDate = new Date(expiry_at);
    // Validate expiry_at is in the future
    if (expiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be a future date-time",
      });
    }
    if (discounted_price >= actual_price) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be less than actual_price",
      });
    }
    const vendorId = req.user.userId;
    // Insert into DB
    const insertFoodListingQuery = `
      INSERT INTO food_listings 
      (vendor_id, food_details, actual_price, discounted_price, bags_available, category, special_instructions, pickup_address, show_brand, best_before, expiry_at)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;
    const values = [
      vendorId,
      food_details,
      actual_price,
      discounted_price,
      bags_available,
      category,
      special_instructions || null,
      pickup_address,
      show_brand,
      best_before,
      expiry_at,
    ];

    const result = await pool.query(insertFoodListingQuery, values);

    return res.status(201).json({
      success: true,
      message: "Food listing added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  }
};

const updateFoodListingStatus = async (req, res) => {
  try {
    const { listingId, status } = req.body;
    const vendorId = req.user.userId;
    if (!listingId || !status) {
      return res.status(400).json({
        success: false,
        message: "listingId and status are required",
      });
    }
    //Allowed statuses
    const allowed = ["sold", "deleted", "expired"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }
    //get current status
    const current = await pool.query(
      `SELECT status FROM food_listings 
       WHERE id = $1 AND vendor_id = $2`,
      [listingId, vendorId]
    );

    if (current.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you do not own it",
      });
    }

    const currentStatus = current.rows[0].status;

    // If status is same then do NOT update
    if (currentStatus === status) {
      return res.status(200).json({
        success: true,
        message: `Status is already '${status}', no update required`,
        data: { id: listingId, status },
      });
    }
    //state transition rule
    const allowedTransitions = {
      active: ["sold", "deleted"],
      sold: [],
      deleted: [],
      expired: [],
    };
    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from '${currentStatus}' to '${status}'`,
      });
    }

    //if status is different then perform update
    const result = await pool.query(
      `UPDATE food_listings
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND vendor_id = $3
      RETURNING *;
      `,
      [status, listingId, vendorId]
    );

    return res.status(200).json({
      success: true,
      message: `Listing marked as ${status}`,
      data: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong...", error });
  }
};

const getVendorFoodListings = async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const status = req.query.status || null;
    //Validate status if provided
    const allowedStatuses = ["active", "sold", "deleted", "expired"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }
    // If no status provided then get all listings
    let listings;
    if (!status) {
      const result = await pool.query(
        `
        SELECT *
        FROM food_listings
        WHERE vendor_id = $1
        ORDER BY created_at DESC;
        `,
        [vendorId]
      );
      listings = result.rows;
    } else {
      // Fetch listings with specific status
      const result = await pool.query(
        `
      SELECT *
      FROM food_listings
      WHERE vendor_id = $1 AND status = $2
      ORDER BY created_at DESC;
      `,
        [vendorId, status]
      );
      listings = result.rows;
    }

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  }
};

const getVendorListingStats = async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const result = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE status = 'active') AS active_count,
        COUNT(*) FILTER (WHERE status = 'expired') AS expired_count,
        COALESCE(SUM(bags_available) FILTER (WHERE status = 'sold'), 0) AS bags_rescued_count
      FROM food_listings
      WHERE vendor_id = $1;
      `,
      [vendorId]
    );
    const result2 = await pool.query(
      `SELECT count(*) AS bags_served from ORDERS WHERE vendor_id=$1 AND status='delivered'`,
      [vendorId]
    );
    return res.status(200).json({
      success: true,
      stats: { ...result.rows[0], ...result2.rows[0] },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  }
};

module.exports = {
  addFoodListing,
  updateFoodListingStatus,
  getVendorFoodListings,
  getVendorListingStats,
};
