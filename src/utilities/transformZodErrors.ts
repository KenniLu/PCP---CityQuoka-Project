import { z } from 'zod'

export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }))
}