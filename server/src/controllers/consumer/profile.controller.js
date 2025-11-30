const { pool } = require("../../config/db");
const getConsumerProfileDetails = async (req, res) => {
  try {
    //get user id from verify token logic
    const userId = req.user.userId;
    //query to get required fields
    const selectConsumerQuery = `SELECT email, full_name, phone_number, address FROM users WHERE id=$1`;
    const result = await pool.query(selectConsumerQuery, [userId]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Consumer profile not found" });
    }
    return res.status(200).json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  }
};
const updateConsumerProfileDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, address, latitude, longitude } = req.body;
    const updateQuery = `
      UPDATE users 
      SET full_name = $1,
          address = $2,
          latitude = $3,
          longitude = $4
      WHERE id = $5
      RETURNING id, email, full_name, phone_number, address, latitude, longitude;
    `;
    const values = [fullName, address, latitude, longitude, userId];
    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong..." });
  }
};
module.exports = { getConsumerProfileDetails, updateConsumerProfileDetails };
