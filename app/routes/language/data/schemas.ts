import { z } from "zod";

export const SetLanguageSchema = z.object({
  language: z.enum(["en", "es"]),
  userId: z.string().min(3),
  email: z.string().min(3),
});
