const z = require("zod");

const profileSchema = z.object({
  fullName: z.string().min(3).max(100),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

module.exports = profileSchema;
