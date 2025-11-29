const { z } = require("zod");

const createFoodListingSchema = z.object({
  food_details: z.string().min(5, "Food details must be at least 5 characters"),

  actual_price: z.number().positive("Actual price must be a positive number"),

  discounted_price: z
    .number()
    .positive("Discounted price must be a positive number"),

  bags_available: z
    .number()
    .int()
    .positive("Bags available must be a positive integer"),

  category: z.string().min(2, "Category is required"),

  special_instructions: z.string().optional(),

  pickup_address: z.string().min(5, "Pickup address required"),

  show_brand: z.boolean(),

  best_before: z.string(), // stored as TEXT

  expiry_at: z.iso.datetime("expiry_at must be a valid datetime string"),

  status: z
    .string()
    .default("active")
    .refine(
      (val) => ["active", "sold", "expired", "deleted"].includes(val),
      "Invalid status"
    ),
});
module.exports = { createFoodListingSchema };
