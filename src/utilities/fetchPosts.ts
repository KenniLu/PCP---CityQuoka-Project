import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { categoriesPosts } from '@/db/schema'
import { desc, eq, and, inArray } from '@payloadcms/db-postgres/drizzle'

export const fetchFeaturedPostsByCategoryPaths = cache(async (paths) => {
  const payload = await getPayload({ config: configPromise })
  const productIds = await payload.db.drizzle
    .select({
      postId: categoriesPosts.postId,
    })
    .from(categoriesPosts)
    .where(
      and(
        inArray(categoriesPosts.categoryPath, paths),
        eq(categoriesPosts.featured, true),
        eq(categoriesPosts.standalone, true),
      ),
    )
    .orderBy(desc(categoriesPosts.postId))
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
      id: {
        in: [...new Set(productIds.map((id) => id['postId']))],
      },
    },
  })
  return result.docs || []
})

export const fetchPostsByCategoryPaths = cache(async (paths, limit = 20, offset = 0) => {
  const payload = await getPayload({ config: configPromise })
  const productIds = await payload.db.drizzle
    .select({
      postId: categoriesPosts.postId,
    })
    .from(categoriesPosts)
    .where(and(inArray(categoriesPosts.categoryPath, paths), eq(categoriesPosts.standalone, true)))
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
      id: {
        in: [...new Set(productIds.map((id) => id['postId']))],
      },
    },
  })
  return result.docs || []
})
