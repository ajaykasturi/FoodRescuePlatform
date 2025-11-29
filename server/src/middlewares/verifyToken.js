const jwt = require("jsonwebtoken");

const verifyConsumerToken = (req, res, next) => {
  const token = req.cookies["authToken"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Decoded Token:", decoded);
    req.userId = decoded.userId;
    userRole = decoded.userRole;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userRole: decoded.userRole,
    };
    if (userRole == "consumer") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Token Error:", error.message); // Log errors
    return res.status(401).json({ message: "Unauthorized" });
  }
};
const verifyVendorToken = (req, res, next) => {
  const token = req.cookies["authToken"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Decoded Token:", decoded);
    req.userId = decoded.userId;
    userRole = decoded.userRole;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userRole: decoded.userRole,
      businessId: decoded.businessId,
    };
    if (userRole == "vendor") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Token Error:", error.message); // Log errors
    return res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = { verifyConsumerToken, verifyVendorToken };
