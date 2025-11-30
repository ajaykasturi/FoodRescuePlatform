const express = require("express");
const authRouter = require("./auth.route");
const vendorRouter = require("./vendor.route");
const consumerRouter = require("./consumer.route");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/vendor", vendorRouter);
router.use("/consumer", consumerRouter);
module.exports = router;
