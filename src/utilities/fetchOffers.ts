import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Offer } from '@/payload-types'

type OfferStatus = NonNullable<Offer['status']>

type FetchOffersOptions = {
  limit?: number
  tags?: string[]
  status?: OfferStatus | OfferStatus[] | 'all'
  includeExpired?: boolean
  providerId?: number | string | null
}

const normalizeStatus = (status?: FetchOffersOptions['status']): OfferStatus[] | undefined => {
  if (!status || status === 'all') {
    return undefined
  }

  if (Array.isArray(status)) {
    return status
  }

  return [status]
}

export const fetchOffers = cache(async (options: FetchOffersOptions = {}): Promise<Offer[]> => {
  const {
    limit = 100,
    tags,
    status,
    includeExpired = false,
    providerId,
  } = options

  const payload = await getPayload({ config: configPromise })

  const where: Record<string, unknown> = {}

  if (providerId) {
    where.provider = {
      equals: providerId,
    }
  }

  if (tags && tags.length > 0) {
    const uniqueTags = Array.from(new Set(tags))
    where.tags = uniqueTags.length === 1
      ? { contains: uniqueTags[0] }
      : { in: uniqueTags }
  }

  const normalizedStatus = normalizeStatus(status)
  if (normalizedStatus && normalizedStatus.length > 0) {
    where.status = normalizedStatus.length === 1
      ? { equals: normalizedStatus[0] }
      : { in: normalizedStatus }
  }

  if (!includeExpired) {
    const nowIso = new Date().toISOString()
    where.or = [
      {
        expiresAt: {
          greater_than_equal: nowIso,
        },
      },
      {
        expiresAt: {
          equals: null,
        },
      },
    ]
  }

  const result = await payload.find({
    collection: 'offers',
    limit,
    depth: 2,
    sort: ['-startsAt', '-createdAt'],
    where,
  })

  return result.docs as Offer[]
})

export type { FetchOffersOptions }
