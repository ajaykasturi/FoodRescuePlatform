const z = require("zod");

const VendorSignUpSchema = z.object({
  email: z.email(),
  fullName: z.string().min(3).max(100),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  termsAccepted: z.boolean(),
  businessName: z.string(),
  businessLicense: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\+\d{1}\s\d{3}\s\d{3}\s\d{4}$/, {
      message: "Phone number must be in format: +x xxx xxx xxxx",
    })
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
    }),
  confirmPassword: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
    }),
});

module.exports = VendorSignUpSchema;
