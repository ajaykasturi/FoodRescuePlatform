const z = require("zod");
const signUpSchema = require("../../schemaValidator/signUpSchema");
const signUpSchemaValidator = (req, res, next) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (parsed.success) {
    // res.status(200).json(parsed); //this is for testing the api
    next();
    return;
  } else {
    res.status(422).json({ errors: parsed?.error?.issues });
    return;
  }
};
module.exports = signUpSchemaValidator;
