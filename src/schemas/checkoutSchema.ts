import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().min(10, { message: 'Phone number is invalid' }),
  city: z.string().min(1, { message: 'City is required' }),
  postal: z.string().min(4, { message: 'Postal code is invalid' }),
  detail: z.string().min(5, { message: 'Address is required' }),
  shipping: z.number().min(1, { message: 'Please select a shipping method' }),
});
