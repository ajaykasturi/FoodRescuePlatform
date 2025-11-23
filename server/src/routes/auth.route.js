const express = require("express");
const signUpSchemaValidator = require("../middlewares/validators/signupValidator");
const { handleConsumerRegister } = require("../controllers/signup.controller");
const router = express.Router();

router.post(
  "/consumer-register",
  signUpSchemaValidator,
  handleConsumerRegister
);

module.exports = router;
