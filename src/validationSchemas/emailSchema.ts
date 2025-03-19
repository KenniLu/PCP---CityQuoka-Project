import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email({message: 'Email is not valid'})
});

export type EmailFormValues = z.infer<typeof emailSchema>