import { format } from '@/hooks/formatSlug'
import { categoriesPosts } from '@/db/schema'
import { eq } from '@payloadcms/db-postgres/drizzle'
import { Category, Post } from '@/payload-types'
import type { CollectionAfterChangeHook } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import { areArraysDifferent } from '@/utilities/areArraysDifferent'

export const updateCategoryPosts: CollectionAfterChangeHook<Post> = async ({
  doc,
  req: { payload, query },
  context,
}) => {
  if (query.draft === 'true' || query.autosave === 'true') {
    return doc
  }

  if (doc._status === 'published') {
    const previousPublished = context.previousPublished as { [key: string]: unknown }
    const previousPublishedCategoryIds = (previousPublished?.categories as number[]) || []
    const currentCategoryIds = (doc.categories as number[]) || []

    const arraysDifferent = areArraysDifferent(previousPublishedCategoryIds, currentCategoryIds)

    if (arraysDifferent) {
      await payload.db.drizzle.delete(categoriesPosts).where(eq(categoriesPosts.postId, doc.id))

      const currentCategories = await payload.find({
        collection: 'categories',
        where: {
          id: {
            in: currentCategoryIds,
          },
        },
      })
      type InsertUser = typeof categoriesPosts.$inferInsert
      const recordsToAdd: InsertUser[] = []
      const collectedPaths: { [key: string]: boolean } = {}
      currentCategories.docs.forEach((category: Category) => {
        let path = ''
        ;(category?.breadcrumbs || []).forEach((crumb) => {
          path = `${path}/${format(crumb.label!)}`
          if (!collectedPaths[path]) {
            const providerId = ( doc.provider && typeof doc.provider === 'object' ) ? doc.provider.id : typeof doc.provider === 'number' ? doc.provider : null
            recordsToAdd.push({
              categoryId: crumb.doc as number,
              postId: doc.id,
              categoryPath: path,
              featured: doc.featured,
              standalone: doc.standalone,
              providerId
            })
            collectedPaths[path] = true
          }
        })
      })
      if (recordsToAdd.length > 0) {
        await payload.db.drizzle.insert(categoriesPosts).values(recordsToAdd)
      }
    } else {
      const fieldUpdates: { [key: string]: unknown } = {}
      let changed = false
      if (previousPublished.featured !== doc.featured) {
        fieldUpdates.featured = doc.featured
        changed = true
      }
      if (previousPublished.standalone !== doc.standalone) {
        fieldUpdates.standalone = doc.standalone
        changed = true
      }
      if (changed) {
        await payload.db.drizzle
          .update(categoriesPosts)
          .set({ ...fieldUpdates, updatedAt: sql`now()` })
          .where(eq(categoriesPosts.postId, doc.id))
      }
    }
  }
}
