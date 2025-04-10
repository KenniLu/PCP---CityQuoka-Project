import { z } from 'zod'

export const passwordResetSchema = z
  .object({
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

export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>
