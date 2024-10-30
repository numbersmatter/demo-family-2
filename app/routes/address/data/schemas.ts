import { z } from "zod";

export const AddressSchema = z.object({
  street: z
    .string({ required_error: "Street is required" })
    .min(1, { message: "Street must be at least 1 character" }),
  unit: z.string().default(" "),
  city: z
    .string({ required_error: "City is required" })
    .min(1, { message: "City must be at least 1 character" }),
  state: z.literal("NC", { invalid_type_error: "Must be NC" }),
  zip: z
    .string({ required_error: "Zip is required" })
    .regex(/^\d{5}$/, { message: "Zip must be 5 digits" }),
  userId: z.string().min(4, { message: "UserId must be at least 4 character" }),
});
