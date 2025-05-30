import { z } from 'zod'

const SocialLinkSchema = z.object({
  name: z.enum(['facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'youtube', 'pinterest', 'snapchat']),
  profile: z.string().min(1, 'Profile link is required')
});

const SocialLinksSchema = z.array(SocialLinkSchema)

export const providerInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email({ message: 'Email is not valid' }),
  socialLinks: SocialLinksSchema
})

export type ProviderInfoFormValues = z.infer<typeof providerInfoSchema>
