import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cmsUsers } from '@/db/schema'
import { eq } from '@payloadcms/db-postgres/drizzle'
import { profileSchema } from '@/validationSchemas/profileSchema'
import { sql } from '@payloadcms/db-postgres'
import { ZodError } from 'zod'

type CmsUser = typeof cmsUsers.$inferSelect

// Ensure the client always receives defined strings for its form fields.
const mapUserProfile = (user: CmsUser) => ({
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
  mobileNumber: user.mobileNumber ?? '',
  email: user.email ?? '',
  address: user.address ?? '',
  city: user.city ?? '',
  state: user.state ?? '',
  postalCode: user.postalCode ?? '',
})

// Return the authenticated user's saved profile details.
export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })
  const user = await payload.db.drizzle
    .select()
    .from(cmsUsers)
    .where(eq(cmsUsers.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0] ?? null)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(mapUserProfile(user))
}

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  let data: unknown
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  try {
    const parsed = profileSchema.parse(data)
    // Normalise casing-sensitive values before persisting them.
    const normalized = {
      ...parsed,
      email: parsed.email.toLowerCase(),
    }

    const [updatedUser] = await payload.db.drizzle
      .update(cmsUsers)
      .set({
        ...normalized,
        updatedAt: sql`now()`,
      })
      .where(eq(cmsUsers.id, session.user.id))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(mapUserProfile(updatedUser))
  } catch (error) {
    if (error instanceof ZodError) {
      // Surface validation errors so the client can map them to fields.
      return NextResponse.json(
        { error: 'Invalid profile data', issues: error.flatten() },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message.includes('duplicate key value')) {
      return NextResponse.json({ error: 'Email is already taken' }, { status: 409 })
    }

    console.error('Failed to update profile', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
