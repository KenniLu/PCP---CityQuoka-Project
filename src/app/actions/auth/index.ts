'use server'
import { z } from "zod";
import { registerSchema, RegisterFormValues } from '@/validationSchemas/registerSchema'
// import { Prisma, PrismaClient } from '@prisma/client';
// import { db } from "@/db";
// import { users } from "@/db/schema";
import bcrypt from 'bcryptjs'
import { eq, sql, and } from '@payloadcms/db-postgres/drizzle'
import { cmsUsers } from "@/db/schema";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LoginFormValues, loginSchema } from "@/validationSchemas/loginSchema";

// import { setFlashMessage } from '@/utilities/flash-message'

// const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, (await bcrypt.genSalt(10)))
}


export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
};

export async function registerUser(formData: RegisterFormValues) {
  try {
    const { email, firstName, lastName, password } = registerSchema.parse(formData)
    const hashedPassword = await hashPassword(password as string)
    const payload = await getPayload({ config: configPromise })
    // await db.insert(users).values({email, firstName, lastName, password: hashedPassword, status: 'ACTIVE' })
    // await payload.db.drizzle.insert(cmsUsers).values({email, password: hashPassword, firstName, lastName})
    const user = await payload.db.drizzle.query.cmsUsers.findFirst({
      where: eq(cmsUsers.email, email)
    });
    if(user){
      return {
        error: 'Account already exists for this email.',
        success: false,
      }
    }
    await payload.db.drizzle.insert(cmsUsers as any).values({firstName, lastName, email, password: hashedPassword})
    return {
      success: true
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: await transformZodErrors(error),
        success: false
      }
    }
    return ({ error: "An unexpected error occurred", data: null })
  }
}

export async function loginUser(formData: LoginFormValues) {
  try {
    const { email, password } = loginSchema.parse(formData)
    if (!email || !password) return null
    const payload = await getPayload({ config: configPromise })
    const user = await payload.db.drizzle.query.cmsUsers.findFirst({
      where: eq(cmsUsers.email, email)
    });
    if (!user || !user.password) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  } catch (error) {
    return null
  }
}