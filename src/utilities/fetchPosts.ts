import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { categoriesPosts } from '@/db/schema'
import { desc, eq, and, isNull } from '@payloadcms/db-postgres/drizzle'
import { unstable_cache } from 'next/cache'
import type { Post } from '@/payload-types'

export const fetchHeroPosts = cache(
  unstable_cache(
    async (limit: number, providerId: null | number = null): Promise<Partial<Post>[]> => {
      const payload = await getPayload({ config: configPromise })
      const fetchedPosts = await payload.find({
        collection: 'posts',
        select: {
          id: true,
          title: true,
          hero_title: true,
          hero_subtitle: true,
          hero_image: true,
          image: true,
          slug: true,
          categories: true,
        },
        depth: 1,
        limit,
        where: {
          hero: {
            equals: true,
          },
          _status: {
            equals: 'published',
          },
          provider: {
            equals: providerId,
          },
        },
        sort: '-publishedAt',
      })

      return fetchedPosts.docs
    },
    [],
    { tags: ['hero-posts'] },
  ),
)

export const fetchPostBySlug = async (
  slug: string,
  draft: boolean,
  providerId: null | number = null,
) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
      provider: {
        equals: providerId,
      },
    },
  })
  return result.docs?.[0] || null
}

export const fetchFeaturedPostsByCategoryPath = cache(
  async (path: string, providerId: null | number = null) => {
    return await unstable_cache(
      async (path) => {
        const payload = await getPayload({ config: configPromise })
        const postIds = await payload.db.drizzle
          .select({
            postId: categoriesPosts.postId,
          })
          .from(categoriesPosts)
          .where(
            and(
              eq(categoriesPosts.categoryPath, path),
              eq(categoriesPosts.featured, true),
              eq(categoriesPosts.standalone, true),
              ...(providerId
                ? [eq(categoriesPosts.providerId, providerId)]
                : [isNull(categoriesPosts.providerId)]),
            ),
          )
          .limit(10)

        const result = await payload.find({
          collection: 'posts',
          limit: 10,
          select: {
            id: true,
            title: true,
            subTitle: true,
            image: true,
            slug: true,
            categories: true,
          },
          where: {
            and: [
              {
                id: {
                  in: [...new Set(postIds.map((id) => id['postId']))],
                },
              },
              {
                _status: {
                  equals: 'published',
                },
              },
            ],
          },
          sort: '-publishedAt',
        })
        return result.docs || []
      },
      [],
      { tags: [`category-featured-${path}`] },
    )(path)
  },
)

export const fetchPostsByCategoryPath = cache(
  async (path: string, limit = 20, offset = 0, providerId: null | number = null) => {
    return await unstable_cache(
      async (path, limit, offset) => {
        const payload = await getPayload({ config: configPromise })
        const postIds = await payload.db.drizzle
          .select({
            postId: categoriesPosts.postId,
          })
          .from(categoriesPosts)
          .where(
            and(
              eq(categoriesPosts.categoryPath, path),
              eq(categoriesPosts.standalone, true),
              ...(providerId
                ? [eq(categoriesPosts.providerId, providerId)]
                : [isNull(categoriesPosts.providerId)]),
            ),
          )
          .orderBy(desc(categoriesPosts.postId))
          .limit(limit)
          .offset(offset)

        const result = await payload.find({
          collection: 'posts',
          limit: limit,
          select: {
            id: true,
            title: true,
            image: true,
            slug: true,
            categories: true,
          },
          where: {
            and: [
              {
                id: {
                  in: [...new Set(postIds.map((id) => id['postId']))],
                },
              },
              {
                _status: {
                  equals: 'published',
                },
              },
            ],
          },
          sort: '-publishedAt',
        })
        return result.docs || []
      },
      [],
      { tags: [`category-posts-${path}`] },
    )(path, limit, offset)
  },
)
