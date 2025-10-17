import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSessionContext } from '@/utilities/userUtilities'

const TAG_ALIASES: Record<string, string> = {
  featured: 'featured',
  near: 'nearby',
  nearby: 'nearby',
  'this-week': 'this-week',
  week: 'this-week',
}

const OFFER_STATUS = new Set(['unclaimed', 'ready', 'claimed'])

type OfferDoc = {
  id: number | string
  title: string
  summary: string
  status: 'unclaimed' | 'ready' | 'claimed'
  startsAt?: string | null
  expiresAt: string | null
  tags?: string[] | null
  coverImage?: null | number | {
    id: number | string
    alt?: string | null
    url?: string | null
  }
}

type OfferResponse = {
  id: number | string
  title: string
  summary: string
  status: 'unclaimed' | 'ready' | 'claimed'
  startsAt: string | null
  expiresAt: string | null
  tags: string[]
  coverImage: null | {
    id: number | string
    alt: string | null
    url: string | null
  }
}

const normaliseTag = (value: string | null) => {
  if (!value) return null
  const key = value.trim().toLowerCase()
  return TAG_ALIASES[key] ?? null
}

const mapOffer = (offer: OfferDoc): OfferResponse => {
  const coverImage = typeof offer.coverImage === 'object' && offer.coverImage !== null
    ? {
        id: offer.coverImage.id,
        alt: offer.coverImage.alt ?? null,
        url: offer.coverImage.url ?? null,
      }
    : null

  return {
    id: offer.id,
    title: offer.title,
    summary: offer.summary,
    status: offer.status,
    startsAt: offer.startsAt ?? null,
    expiresAt: offer.expiresAt ?? null,
    tags: offer.tags ?? [],
    coverImage,
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionContext } = (await getSessionContext()) || {}
    const searchParams = request.nextUrl.searchParams

    const payload = await getPayload({ config: configPromise })

    let providerId = sessionContext?.currentProvider?.id ?? null
    const requestedProviderId = searchParams.get('providerId')
    if (requestedProviderId && sessionContext?.isSuperAdmin) {
      const numericProviderId = Number(requestedProviderId)
      if (!Number.isNaN(numericProviderId)) {
        providerId = numericProviderId
      }
    }

    if (!providerId) {
      return NextResponse.json({ error: 'Provider context is required' }, { status: 400 })
    }

    const tag = normaliseTag(searchParams.get('tag'))
    const statusParam = searchParams.get('status')
    const status = statusParam && OFFER_STATUS.has(statusParam) ? statusParam : null

    const limitParam = Number(searchParams.get('limit'))
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 20

    const pageParam = Number(searchParams.get('page'))
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

    const where: Record<string, unknown> = {
      provider: {
        equals: providerId,
      },
    }

    if (tag) {
      where.tags = {
        contains: tag,
      }
    }

    if (status) {
      where.status = {
        equals: status,
      }
    }

    const offers = await payload.find({
      collection: 'offers',
      depth: 1,
      limit,
      page,
      sort: '-updatedAt',
      where,
    })

    return NextResponse.json({
      docs: (offers.docs as OfferDoc[]).map(mapOffer),
      hasNextPage: offers.hasNextPage,
      nextPage: offers.nextPage,
      totalDocs: offers.totalDocs,
      totalPages: offers.totalPages,
    })
  } catch (error) {
    console.error('Error fetching offers', error)
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 })
  }
}
