const express = require("express");
const signUpSchemaValidator = require("../middlewares/validators/signupValidator");
const { handleConsumerRegister } = require("../controllers/signup.controller");
const {
  handleConsumerVerifyOTP,
} = require("../controllers/verifyOTP.controller");
const { handleResendOTP } = require("../controllers/resendOTP.controller");
const router = express.Router();

router.post(
  "/consumer-register",
  signUpSchemaValidator,
  handleConsumerRegister
);

router.post("/consumer-verification-otp", handleConsumerVerifyOTP);

router.post("/consumer-resend-otp", handleResendOTP);

module.exports = router;
