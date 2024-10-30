import { z } from 'zod';

export const RequestReservationSchema = z.object({
  eventId: z.string().min(15),
  time: z.coerce.number().min(50),
  semesterId: z.string().min(15),
});
