const z = require("zod");
const {
  createFoodListingSchema,
} = require("../../schemaValidator/foodlistingSchema");

const foodListingSchemaValidator = (req, res, next) => {
  const parsed = createFoodListingSchema.safeParse(req.body);
  if (parsed.success) {
    // res.status(200).json(parsed); //this is for testing the api
    next();
    return;
  } else {
    const messages = parsed?.error?.issues.map((err) => err.message);
    res.status(422).json({ success: false, message: messages });
    return;
  }
};
module.exports = foodListingSchemaValidator;
