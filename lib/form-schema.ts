import z from "zod";

export const createCustomerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  aadharNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length === 12 && /^\d+$/.test(val)),
      "Aadhar number must be exactly 12 digits"
    ),
});
