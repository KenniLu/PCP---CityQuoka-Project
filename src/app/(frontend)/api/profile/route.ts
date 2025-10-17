import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from '@payloadcms/db-postgres/drizzle'

import { auth } from '@/auth'
import { cmsUsers } from '@/db/schema'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  mobileNumber: z.string().trim().min(1, 'Mobile number is required'),
  email: z.string().trim().email('A valid email is required'),
  address: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
})

type ProfilePayload = z.infer<typeof profileSchema>

type CmsUser = typeof cmsUsers.$inferSelect

const mapUserToProfile = (user: CmsUser) => ({
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
  mobileNumber: user.mobileNumber ?? '',
  email: user.email,
  address: user.address ?? '',
  city: user.city ?? '',
  state: user.state ?? '',
  postalCode: user.postalCode ?? '',
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })

    const user = await payload.db.drizzle
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.id, session.user.id))
      .then((rows) => (rows.length > 0 ? rows[0] : null))

    if (!user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile: mapUserToProfile(user) }, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
    }

    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const updates: ProfilePayload = parsed.data

    const payload = await getPayload({ config: configPromise })

    const existingUser = await payload.db.drizzle
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.id, session.user.id))
      .then((rows) => (rows.length > 0 ? rows[0] : null))

    if (!existingUser) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (updates.email !== existingUser.email) {
      const emailOwner = await payload.db.drizzle
        .select({ id: cmsUsers.id })
        .from(cmsUsers)
        .where(eq(cmsUsers.email, updates.email))
        .then((rows) => (rows.length > 0 ? rows[0] : null))

      if (emailOwner && emailOwner.id !== session.user.id) {
        return NextResponse.json({ error: 'Email is already in use' }, { status: 409 })
      }
    }

    const [updatedUser] = await payload.db.drizzle
      .update(cmsUsers)
      .set({
        firstName: updates.firstName,
        lastName: updates.lastName,
        mobileNumber: updates.mobileNumber,
        email: updates.email,
        address: updates.address,
        city: updates.city,
        state: updates.state,
        postalCode: updates.postalCode,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cmsUsers.id, session.user.id))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        profile: mapUserToProfile(updatedUser),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating profile', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
