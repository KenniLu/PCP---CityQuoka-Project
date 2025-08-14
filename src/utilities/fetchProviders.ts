import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
// import { unstable_cache } from 'next/cache'
import type { Provider, Location } from '@/payload-types'

export const fetchProviderBySlug = async (
  slug: string
): Promise<Provider | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'providers',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
}

export const fetchLocationsByProvider = cache(
  async (providerId: number, searchQuery?: string, limit: number = 20): Promise<Location[]> => {
    const payload = await getPayload({ config: configPromise })
    
    const whereClause: any = {
      provider: {
        equals: providerId,
      },
      status: {
        equals: 'active',
      },
    }

    if (searchQuery) {
      whereClause.or = [
        {
          name: {
            contains: searchQuery,
          },
        },
        {
          city: {
            contains: searchQuery,
          },
        },
        {
          address: {
            contains: searchQuery,
          },
        },
      ]
    }

    const result = await payload.find({
      collection: 'locations',
      limit,
      where: whereClause,
      sort: 'name',
    })
    
    return result.docs || []
  }
)

export const fetchCachedProviderBySlug = cache(async (slug: string) => {
    // return await unstable_cache(
    //   fetchProviderBySlug,
    //   [slug],
    //   { tags: [`provider-${slug}`] }
    // )(slug, draft)
  // }
  return await fetchProviderBySlug(slug)
})