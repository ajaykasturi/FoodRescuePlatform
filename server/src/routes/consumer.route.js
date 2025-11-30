const express = require("express");
const { verifyConsumerToken } = require("../middlewares/verifyToken");
const {
  getConsumerProfileDetails,
  updateConsumerProfileDetails,
} = require("../controllers/consumer/profile.controller");
const profileSchemaValidator = require("../middlewares/validators/profileValidator");
const {
  getNearByListings,
  getTodayListings,
  viewListingDetials,
} = require("../controllers/consumer/getListings.controller");
const {
  checkOutOrder,
  getConsumerOrders,
  cancelOrder,
  rateOrder,
} = require("../controllers/consumer/order.controller");

const router = express.Router();
//get consumer profile details
router.get("/profile", verifyConsumerToken, getConsumerProfileDetails);
//update consumer profile details
router.patch(
  "/profile",
  verifyConsumerToken,
  profileSchemaValidator,
  updateConsumerProfileDetails
);
//get listings nearby and nearby+today
router.get("/near-by", verifyConsumerToken, getNearByListings);

//order by consumer
router.post("/order", verifyConsumerToken, checkOutOrder);
//get orders per consumer
router.get("/orders/my", verifyConsumerToken, getConsumerOrders);
//cancel the order
router.patch("/orders/:id/cancel", verifyConsumerToken, cancelOrder);
//rate the order
router.post("/orders/rate", verifyConsumerToken, rateOrder);
//view a listing
router.get("/listing/:id", verifyConsumerToken, viewListingDetials);
module.exports = router;
