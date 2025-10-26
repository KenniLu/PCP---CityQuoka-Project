import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  mobileNumber: z
    .string()
    .trim()
    .min(6, 'Mobile number must be at least 6 characters long'),
  email: z.string().trim().email({ message: 'Email is not valid' }),
  address: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  postalCode: z.string().trim().min(3, 'Postal code is required'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
