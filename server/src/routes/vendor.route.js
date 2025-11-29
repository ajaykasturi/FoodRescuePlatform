const express = require("express");
const {
  addFoodListing,
  updateFoodListingStatus,
  getVendorFoodListings,
  getVendorListingStats,
} = require("../controllers/vendor/foodlisting.controller");
const { verifyVendorToken } = require("../middlewares/verifyToken");
const foodListingSchemaValidator = require("../middlewares/validators/foodListingValidator");

const router = express.Router();
//route that handles create food listing
router.post(
  "/add-food-listing",
  verifyVendorToken,
  foodListingSchemaValidator,
  addFoodListing
);
//route that handles get food listings with and without status
router.get("/listings", verifyVendorToken, getVendorFoodListings);
//api for marking food-listing as sold
router.patch("/update-status", verifyVendorToken, updateFoodListingStatus);
//vendor listings stats
router.get("/stats", verifyVendorToken, getVendorListingStats);
module.exports = router;
