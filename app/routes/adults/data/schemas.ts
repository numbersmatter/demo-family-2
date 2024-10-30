import { z } from "zod";

export const SetAdultsSchema = z.object({
  adults: z.coerce
    .number({ required_error: "Adults is required" })
    .min(1, { message: "Adults must be at least 1 person" }),
});
