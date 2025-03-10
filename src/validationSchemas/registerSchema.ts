import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Email is not valid' }),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z.string().min(6, { message: 'Password must have at least 6 characters' }),
    passwordConfirmation: z
      .string()
      .min(8, 'Password confirmation must be at least 6 characters long'),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation
    },
    {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    },
  )

export type RegisterFormValues = z.infer<typeof registerSchema>
