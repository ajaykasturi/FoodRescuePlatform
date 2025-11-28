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
const router = express.Router();

//consumer
router.post(
  "/consumer-register",
  signUpSchemaValidator,
  handleConsumerRegister
);

router.post("/verification-otp", handleConsumerVerifyOTP);

router.post("/resend-otp", handleResendOTP);

//vendor
router.post(
  "/vendor-register",
  VendorSignUpSchemaValidator,
  handleVendorRegister
);

//common
router.post("/login", handleLogin);
module.exports = router;
