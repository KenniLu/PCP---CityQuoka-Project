import { z } from 'zod'

export const providerUserRegisterSchema = z
  .object({
    email: z.string().email({ message: 'Email is not valid' }),
    name: z.string().min(1, 'Name is required'),
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

export type ProviderUserRegisterFormValues = z.infer<typeof providerUserRegisterSchema>
