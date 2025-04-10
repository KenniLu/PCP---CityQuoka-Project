import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { categories } from '@/payload-generated-schema'
import { inArray } from '@payloadcms/db-postgres/drizzle'

export const fetchCategoryPathsForSlugs = cache(async (slugs) => {
  const payload = await getPayload({ config: configPromise })

  const categoryDetails = await payload.db.drizzle
    .select({
      id: categories.id,
      parent_id: categories.parent,
      title: categories.title,
      slug: categories.slug,
    })
    .from(categories)
    .where(inArray(categories.slug, slugs))

  const categoryPaths: {
    url: string
    title: string
  }[] = []
  var url = ''
  var parent_id: number | null = null
  slugs.every((slug) => {
    const category = categoryDetails.find(
      (category) => category.parent_id === parent_id && category.slug == slug,
    )
    if (!category) {
      return false
    }
    url = `${url}/${category.slug}`
    categoryPaths.push({ title: category.title, url })
    parent_id = category.id
    return true
  })
  return categoryPaths
})
