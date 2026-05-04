const express = require("express");
const signUpSchemaValidator = require("../middlewares/validators/signupValidator");
const {
  handleConsumerRegister,
} = require("../controllers/consumer/signup.controller");
const {
  handleConsumerVerifyOTP,
} = require("../controllers/consumer/verifyOTP.controller");
const {
  handleResendOTP,
} = require("../controllers/consumer/resendOTP.controller");
const {
  handleVendorRegister,
} = require("../controllers/vendor/signup.controller");
const VendorSignUpSchemaValidator = require("../middlewares/validators/vendorSignUpValidator");
const { handleLogin } = require("../controllers/common/login.controller");
const {
  verifyConsumerToken,
  verifyVendorToken,
} = require("../middlewares/verifyToken");
const { logout } = require("../controllers/common/logout.controller");
const router = express.Router();

//consumer
router.post(
  "/consumer-register",
  signUpSchemaValidator,
  handleConsumerRegister
);
router.post("/validate-consumer-token", verifyConsumerToken, (req, res) => {
  res.status(200).json({ userId: req.userId, userRole: req.user.userRole });
});

router.post("/verification-otp", handleConsumerVerifyOTP);

router.post("/resend-otp", handleResendOTP);

//vendor
router.post(
  "/vendor-register",
  VendorSignUpSchemaValidator,
  handleVendorRegister
);
router.post("/validate-vendor-token", verifyVendorToken, (req, res) => {
  res.status(200).json({ userId: req.userId, userRole: req.user.userRole });
});
//common
router.post("/login", handleLogin);

router.post("/logout", logout);
module.exports = router;
