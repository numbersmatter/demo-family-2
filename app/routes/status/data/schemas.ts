import { z } from 'zod';

export const Schema = z.object({
  name: z.string().min(3),
  type: z.enum(['pickup', 'drive-thru', 'error']),
  eventDate: z.string().transform((val) => new Date(val)),
  semesterId: z.string().min(20),
});