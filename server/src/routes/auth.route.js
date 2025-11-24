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
const router = express.Router();

router.post(
  "/consumer-register",
  signUpSchemaValidator,
  handleConsumerRegister
);

router.post("/consumer-verification-otp", handleConsumerVerifyOTP);

router.post("/consumer-resend-otp", handleResendOTP);

module.exports = router;
