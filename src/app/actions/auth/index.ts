'use server'
import { z } from 'zod'
import { registerSchema, RegisterFormValues } from '@/validationSchemas/registerSchema'
import bcrypt from 'bcryptjs'
import { eq } from '@payloadcms/db-postgres/drizzle'
import { cmsUsers } from '@/db/schema'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LoginFormValues, loginSchema } from '@/validationSchemas/loginSchema'
// import type { SendEmailCommandInput } from '@aws-sdk/client-ses'
import { render } from '@react-email/components'
// import { SES } from '@aws-sdk/client-ses'
import LoginEmail from '@/emails/login-email'
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, await bcrypt.genSalt(10))
}

export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }))
}

export async function registerUser(formData: RegisterFormValues) {
  try {
    const { email, firstName, lastName, password } = registerSchema.parse(formData)
    const hashedPassword = await hashPassword(password as string)
    const payload = await getPayload({ config: configPromise })

    const user = await payload.db.drizzle
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.email, email))
      .then((res) => (res.length > 0 ? res[0] : null))

    if (user) {
      return {
        error: 'Account already exists for this email.',
        success: false,
      }
    }
    await payload.db.drizzle
      .insert(cmsUsers as any)
      .values({ firstName, lastName, email, password: hashedPassword })
    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: await transformZodErrors(error),
        success: false,
      }
    }
    return { error: 'An unexpected error occurred', data: null }
  }
}

export async function loginUser(formData: LoginFormValues) {
  try {
    const { email, password } = loginSchema.parse(formData)
    if (!email || !password) return null
    const payload = await getPayload({ config: configPromise })

    const user = await payload.db.drizzle
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.email, email))
      .then((res) => (res.length > 0 ? res[0] : null))
    if (!user || !user.password) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  } catch (error) {
    return null
  }
}

export async function sendLoginEmail(url: string, recipient: string) {
  // const ses = new SES({
  //   region: process.env.SES_AWS_REGION,
  //   credentials: {
  //     accessKeyId: process.env._AWS_ACCESS_KEY_ID!,
  //     secretAccessKey: process.env._AWS_SECRET_ACCESS_KEY!,
  //   }
  // })
  // const loginEmailHtml = await render(LoginEmail({ url }))
  const { host } = new URL(url)
  try {
    // const params: SendEmailCommandInput = {
    //   Source: 'noreply@cityquokka.com',
    //   Destination: {
    //     ToAddresses: [recipient],
    //   },
    //   Message: {
    //     Body: {
    //       Html: {
    //         Charset: 'UTF-8',
    //         Data: loginEmailHtml,
    //       },
    //     },
    //     Subject: {
    //       Charset: 'UTF-8',
    //       Data: `Your login link to ${host}`,
    //     },
    //   },
    // }

    // await ses.sendEmail(params)
      const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY || "",
      });
    
      const loginEmailHtml = await render(LoginEmail({ url }))
    
      const sentFrom = new Sender("noreply@cityquokka.com", "City Quokka");
      const recipients = [new Recipient(recipient)];
    
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(`Your login link to ${host}`)
        .setHtml(loginEmailHtml);
    
      await mailerSend.email.send(emailParams);

  } catch (error) {
    console.error(`Error sending login emails : ${error}`)
    throw new Error(`Email could not be sent`)
  }
}
