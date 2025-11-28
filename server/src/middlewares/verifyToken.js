const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies["authToken"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Decoded Token:", decoded);
    req.userId = decoded.userId;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userRole: decoded.userRole,
    };
    next();
  } catch (error) {
    console.error("Token Error:", error.message); // Log errors
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { verifyToken };
