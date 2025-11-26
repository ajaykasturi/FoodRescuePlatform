const bcrypt = require("bcrypt");
const { pool } = require("../../config/db");
const { handleResendOTP } = require("../consumer/resendOTP.controller");
const handleVendorRegister = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      email,
      fullName,
      phoneNumber,
      address,
      latitude,
      longitude,
      termsAccepted,
      password,
      confirmPassword,
      businessName,
      businessLicense,
    } = req.body;
    //check if the passwords match
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }
    //check if the terms are accepted by consumer or not
    if (!termsAccepted) {
      res.status(400).json({
        success: false,
        message: "Terms must be accepted",
      });
      return;
    }
    await client.query("BEGIN");
    //check if the email already exists in the database
    const existing = await client.query(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );

    if (existing.rows.length > 0) {
      const vendorRecord = existing.rows[0];
      if (!vendorRecord.email_verified) {
        //if the user exists but not verified then it will delete the existing user details so user can continue with new details
        await client.query("DELETE FROM users WHERE email = $1", [email]);
      } else {
        //it returns 409 status code stating that user already exists and verified in the system
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //insert query
    const insertUserQuery = `
      INSERT INTO users 
        (email, full_name, phone_number, address, latitude, longitude, terms_accepted, password, user_role)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 'vendor')
      RETURNING *;`;

    const userValues = [
      email,
      fullName,
      phoneNumber,
      address,
      latitude,
      longitude,
      termsAccepted,
      hashedPassword,
    ];

    //insert into the database with cosntructed query and values
    const newUser = await client.query(insertUserQuery, userValues);

    const newUserId = newUser.rows[0].id;

    //Insert into business_info
    const insertBusinessQuery = `
      INSERT INTO business_info
        (user_id, legal_name, license_number)
      VALUES
        ($1, $2, $3);`;

    await client.query(insertBusinessQuery, [
      newUserId,
      businessName,
      businessLicense,
    ]);
    //commit to db
    await client.query("COMMIT");
    //This is for testing whether record is created in the database or not
    //res.status(201).json({ success: true, result });

    return await handleResendOTP(req, res);
  } catch (error) {
    await client.query("ROLLBACK");
    //don't reveal the error message, as it keep system at risk
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again",
      //   error, //this is for testing purpose comment after testing bcz this exposes secrets, SQL structure, internal logic.
    });
  } finally {
    client.release(); // release DB connection
  }
};

module.exports = { handleVendorRegister };
