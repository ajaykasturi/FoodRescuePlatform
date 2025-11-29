const express = require("express");
const authRouter = require("./auth.route");
const vendorRouter = require("./vendor.route");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/vendor", vendorRouter);
module.exports = router;
