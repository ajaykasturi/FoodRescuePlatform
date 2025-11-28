const bcrypt = require("bcrypt");
const { pool } = require("../../config/db");
const jwt = require("jsonwebtoken");
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //get the user details
    const result = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    const user = result.rows[0];
    //Check if user exists OR unverified
    if (!user || user.account_status === "unverified" || !user.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    //check if account is locked
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(403).json({
        success: false,
        message: "Account locked. Try again after some time",
      });
    }
    //user blocked case
    if (user.account_status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }
    //user active case
    if (user.account_status === "active") {
      //check for password match
      const isMatch = await bcrypt.compare(password, user.password);
      //wrong password: increment failed attempts
      if (!isMatch) {
        const attempts = user.failed_login_attempts + 1;
        //If lock expired then reset everything
        if (user.locked_until && new Date() > new Date(user.locked_until)) {
          await pool.query(
            `UPDATE users 
            SET failed_login_attempts = 1, locked_until = NULL 
            WHERE email = $1`,
            [email]
          );
        } else if (attempts >= 5) {
          // Lock for 20 minutes
          const lockUntil = new Date(Date.now() + 20 * 60 * 1000);

          await pool.query(
            `UPDATE users 
             SET failed_login_attempts = $1, locked_until = $2 
             WHERE email = $3`,
            [attempts, lockUntil, email]
          );

          return res.status(403).json({
            success: false,
            message: "Account locked due to multiple failed attempts",
          });
        } else {
          // Just increase attempts
          await pool.query(
            `UPDATE users 
             SET failed_login_attempts = $1 
             WHERE email = $2`,
            [attempts, email]
          );
        }
        return res
          .status(401)
          .json({ success: false, message: "Incorrect email or password" });
      }
      //correct password: reset failed attempts & lock
      await pool.query(
        `UPDATE users 
         SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() 
         WHERE email = $1`,
        [email]
      );

      const userRole = user.user_role;
      if (!userRole) {
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong..." });
      }
      let token;
      let flag = false;
      //consumer: assign logic
      if (userRole === "consumer") {
        token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            userRole: userRole,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2d",
          }
        );
        flag = true;
      }
      //vendor: check if the vendor business is verified or not
      if (userRole === "vendor") {
        //Fetch business details from business_info table
        const bizResult = await pool.query(
          `SELECT id, verification_status
            FROM business_info 
            WHERE user_id = $1`,
          [user.id]
        );
        if (bizResult.rowCount === 0) {
          return res.status(403).json({
            success: false,
            message:
              "Business profile not found. Please complete business registration.",
          });
        }
        const business = bizResult.rows[0];
        const status = business.verification_status;
        //Allow ONLY approved vendors to login
        if (status === "pending") {
          return res.status(403).json({
            success: false,
            message:
              "Your business verification is pending. You cannot log in until it is approved.",
          });
        } else if (status === "rejected") {
          return res.status(403).json({
            success: false,
            message:
              "Your business verification was rejected. Contact support.",
          });
        } else if (status !== "approved") {
          return res.status(403).json({
            success: false,
            message: "Invalid business status. Contact support.",
          });
        }

        if (status === "approved") {
          token = jwt.sign(
            {
              email: user.email,
              userRole: userRole,
              businessId: business.id,
              userId: user.id,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
          );
          flag = true;
        }
      }

      if (flag) {
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 2 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });
        return res.status(200).json({ userId: user.id }); //remove token from response
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
module.exports = { handleLogin };
