const z = require("zod");
const profileSchema = require("../../schemaValidator/profileSchema");
const profileSchemaValidator = (req, res, next) => {
  const parsed = profileSchema.safeParse(req.body);
  if (parsed.success) {
    // res.status(200).json(parsed); //this is for testing the api
    next();
    return;
  } else {
    res.status(422).json({ errors: parsed?.error?.issues });
    return;
  }
};
module.exports = profileSchemaValidator;
