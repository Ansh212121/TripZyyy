import * as z from 'zod';

export const rideSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  availableSeats: z
    .number({ invalid_type_error: 'Seats must be a number' })
    .min(1, 'At least one seat must be available'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be at least 0'),
  description: z.string().optional(),
});
