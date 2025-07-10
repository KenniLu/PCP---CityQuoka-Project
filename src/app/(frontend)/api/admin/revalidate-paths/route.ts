import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const { paths } = await request.json()
  try {
    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'Paths parameter is required and must be a non-empty array' }, { status: 400 })
    }
    // Auth reference : payload/packages/payload/src/auth/strategies/apiKey.ts
    if (authHeader?.startsWith('users API-Key ')) {
      const apiKey = authHeader.replace('users API-Key ', '')
      const payload = await getPayload({ config: configPromise })
      const apiKeyIndex = crypto.createHmac('sha1', payload.secret).update(apiKey).digest('hex')

      const userQuery = await payload.find({
        collection: 'users',
        depth: 1,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: {
          apiKeyIndex: {
            equals: apiKeyIndex,
          },
        },
      })
      if (userQuery.docs && userQuery.docs.length > 0) {
        const invalidatedCounts = paths.map(path => revalidatePath(path))
        return NextResponse.json({
          revalidated: true,
          paths,
          invalidatedCounts,
        })
      }
    }
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  } catch (error) {
    console.error('Paths revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate paths', message: (error as Error).message },
      { status: 500 },
    )
  }
}