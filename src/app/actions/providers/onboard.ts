'use server'

import {
  providerUserRegisterSchema,
  ProviderUserRegisterFormValues,
} from '@/validationSchemas/providerUserRegisterSchema'
import { providerInfoSchema, ProviderInfoFormValues } from '@/validationSchemas/providerInfoSchema'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'
import { transformZodErrors } from '@/utilities/transformZodErrors'

type OnboardingFormData = {
  user: ProviderUserRegisterFormValues
  provider: ProviderInfoFormValues
}

export async function onboardProvider(formData: OnboardingFormData) {
  const payload = await getPayload({ config: configPromise })
  const transactionID = await payload.db.beginTransaction()
  try {
    const { user: userData, provider: providerData } = formData
    const {
      email: userEmail,
      name: userName,
      password,
    } = providerUserRegisterSchema.parse(userData)
    const {
      email: providerEmail,
      name: providerName,
      description,
      phone,
      socialLinks,
      slug
    } = providerInfoSchema.parse(providerData)


    const provider = await payload.create({
      collection: 'providers',
      data: {
        name: providerName,
        description: description,
        phone: phone,
        email: providerEmail,
        socialLinks: socialLinks,
        slug
      },
      req: { transactionID: transactionID! },
    })
    const adminRole = await payload.create({
      collection: 'user-roles',
      data: {
        name: 'Admin',
        permissions: {
          admin: true,
        },
        provider: provider,
      },
      req: { transactionID: transactionID! },
    })
    const user = await payload.create({
      collection: 'users',
      data: {
        email: userEmail,
        name: userName,
        password,
        userRoles: [adminRole],
      },
      req: { transactionID: transactionID! },
    })
    await payload.db.commitTransaction(transactionID!)
    return {
      success: true,
    }
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID!)
    if (error instanceof z.ZodError) {
      return {
        errors: await transformZodErrors(error),
        success: false,
      }
    }
    return { error: 'An unexpected error occurred', data: null }
  }
}
