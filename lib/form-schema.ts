import z from "zod";

export const createCustomerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .refine(
      (val) => !val || (val.length === 10 && /^\d+$/.test(val)),
      "Phone number must be exactly 10 digits"
    ),
  aadharNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length === 12 && /^\d+$/.test(val)),
      "Aadhar number must be exactly 12 digits"
    ),
});
