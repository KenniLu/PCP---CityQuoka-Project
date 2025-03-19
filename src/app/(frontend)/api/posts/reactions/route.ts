import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { reactions } from '@/db/schema'
import { eq, inArray, and } from '@payloadcms/db-postgres/drizzle'

export type ReactionsResponse = {
  [postId: string]: {
    like: boolean
    save: boolean
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const url = new URL(request.url)
    const searchParams = url.searchParams

    const postIds = searchParams.get('postIds')?.split(",").map((postId) => parseInt(postId))

    if (!postIds) {
      return NextResponse.json({ error: 'postIds parameter is required' }, { status: 400 })
    }

    // Parse postIds - handle both array and comma-separated string formats
    // const postIdsArray = Array.isArray(postIds) ? postIds : postIds.split(',')

    // Query the database for reactions
    const userReactions = await payload.db.drizzle
      .select({
        postId: reactions.postId,
        reaction: reactions.reaction,
      })
      .from(reactions)
      .where(and(eq(reactions.userId, userId), inArray(reactions.postId, postIds)))

    // Build the response object
    const result: ReactionsResponse = userReactions.reduce((_h, {reaction, postId}) => {
      _h[postId] ||= {}
      _h[postId][reaction] = true
      return _h
    },{})

    return NextResponse.json({ reactions: result }, { status: 200 })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { postId, reaction } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'postId parameter is required' }, { status: 400 })
    }
    const validActions = ['like', 'save', 'unlike', 'unsave'] as const
    if (!validActions.includes(reaction)) {
      return NextResponse.json({ error: 'valid reaction is required' }, { status: 400 })
    }
    if (reaction === 'like' || reaction === 'save') {
      const userReactions = await payload.db.drizzle.insert(reactions).values({
        postId,
        userId,
        reaction
      })
    } else {
      const reactionToDelete = reaction === 'unlike' ? 'like' : 'save'
      await payload.db.drizzle
        .delete(reactions)
        .where(
          and(
            eq(reactions.userId, userId),
            eq(reactions.postId, postId),
            eq(reactions.reaction, reactionToDelete),
          ),
        )
    }

    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
