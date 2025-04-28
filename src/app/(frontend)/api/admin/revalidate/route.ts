import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import crypto from 'crypto'
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const { tag } = await request.json()
  try {
    if (!tag) {
      return NextResponse.json({ error: 'Tag parameter is required' }, { status: 400 })
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
        const invalidatedCount = revalidateTag(tag)
        return NextResponse.json({
          revalidated: true,
          tag,
          invalidatedCount,
        })
      }
    }
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate', message: (error as Error).message },
      { status: 500 },
    )
  }
}
