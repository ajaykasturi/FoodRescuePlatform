const { pool } = require("../../config/db");
const getDistance = require("../../utils/getDistance");
const getNearByListings = async (req, res) => {
  try {
    const WITHINDISTANCE = 20; //with in 5KM
    const userId = req.userId;
    const filterToday = req.query.today === "true"; // true or false
    const categoryFilter = req.query.category; // 'prepared' or 'grocery'
    const searchQuery = req.query.search; // multi-word search
    const sort = req.query.sort; // 'price_asc' or 'price_desc'
    //get today's date for optional filter
    const todayDate = new Date().toISOString().slice(0, 10);
    //Fetch user's saved latitude & longitude
    const userResult = await pool.query(
      `SELECT latitude, longitude
       FROM users
       WHERE id = $1;`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const { latitude: userLat, longitude: userLng } = userResult.rows[0];

    if (!userLat || !userLng) {
      return res.status(400).json({
        success: false,
        message: "User location not set",
      });
    }
    //Fetch listings + vendor location (JOIN users)
    let sqlQuery = `SELECT 
      l.id,
      l.food_details,
      l.actual_price,
      l.discounted_price,
      l.bags_available,
      l.category,
      l.special_instructions,
      l.pickup_address,
      l.expiry_at,
      u.latitude AS vendor_lat,
      u.longitude AS vendor_lng,
      u.profile_picture_url,
      b.cover_picture_url,
      b.legal_name
   FROM food_listings l
   JOIN users u ON l.vendor_id = u.id
   JOIN business_info b ON b.user_id = u.id
   WHERE l.status = 'active' AND l.bags_available > 0
     AND (expiry_at AT TIME ZONE 'America/Toronto') > (NOW() AT TIME ZONE 'America/Toronto')`;
    const params = [];
    //if today filter is enabled
    if (filterToday) {
      sqlQuery += ` AND DATE(l.expiry_at) = $1`;
      params.push(todayDate);
    }
    // 4. Apply category filter
    if (categoryFilter) {
      params.push(categoryFilter); // array
      sqlQuery += ` AND LOWER(l.category) = LOWER($${params.length})`;
    }
    // multi-word search filter

    if (searchQuery && searchQuery.trim() !== "") {
      const keywords = searchQuery.trim().split(/\s+/);
      for (const word of keywords) {
        params.push(`%${word}%`);
        sqlQuery += ` AND (
            l.food_details ILIKE $${params.length}
            OR l.category ILIKE $${params.length}
            OR l.special_instructions ILIKE $${params.length}
            OR l.pickup_address ILIKE $${params.length}
            OR b.legal_name ILIKE $${params.length}
        )`;
      }
    }

    sqlQuery += `;`;

    const listingsResult = await pool.query(sqlQuery, params);

    const listings = listingsResult.rows;

    //calculate distance from user's location to vendor location
    const nearby = listings
      .map((item) => {
        const distance = getDistance(
          userLat,
          userLng,
          item.vendor_lat,
          item.vendor_lng
        );
        // Remove vendor_lat & vendor_lng
        const { vendor_lat, vendor_lng, ...rest } = item;
        return {
          ...rest,
          distance: Number(distance.toFixed(2)),
          distanceMeasure: "km",
        };
      })
      .filter((item) => item.distance <= WITHINDISTANCE);
    if (sort) {
      if (sort === "price_asc") {
        nearby.sort((a, b) => a.discounted_price - b.discounted_price);
      } else if (sort === "price_desc") {
        nearby.sort((a, b) => b.discounted_price - a.discounted_price);
      } else if (sort === "distance") {
        nearby.sort((a, b) => a.distance - b.distance);
      }
    }
    return res.json({
      success: true,
      count: nearby.length,
      data: nearby,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong...", error });
  }
};
const viewListingDetials = async (req, res) => {
  try {
    const listingId = req.params.id;
    // 1️⃣ Get listing + vendor details
    const listingResult = await pool.query(
      `
      SELECT 
        l.id,
        l.food_details,
        l.actual_price,
        l.discounted_price,
        l.bags_available,
        l.category,
        l.special_instructions,
        l.pickup_address,
        l.expiry_at,
        l.vendor_id,
        b.legal_name AS business_name,
        b.cover_picture_url,
        u.profile_picture_url,
        u.latitude AS vendor_lat,
        u.longitude AS vendor_lng
      FROM food_listings l
      JOIN users u ON l.vendor_id = u.id
      JOIN business_info b ON b.user_id = u.id
      WHERE l.id = $1 AND l.status = 'active';
      `,
      [listingId]
    );
    if (listingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or inactive",
      });
    }
    const listing = listingResult.rows[0];
    const vendorId = listing.vendor_id;
    const ratingSummaryResult = await pool.query(
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
    const ratingSummary = ratingSummaryResult.rows[0];
    return res.json({
      success: true,
      listing,
      ratingSummary,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong...", error });
  }
};
module.exports = { getNearByListings, viewListingDetials };
