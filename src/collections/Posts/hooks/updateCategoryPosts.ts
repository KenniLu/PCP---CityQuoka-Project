import { format } from '@/hooks/formatSlug'
import { categoriesPosts } from '@/db/schema'
import { eq } from '@payloadcms/db-postgres/drizzle'
import {FieldHook} from 'payload'

export const updateCategoryPosts: FieldHook = async ({ value, previousValue, originalDoc, req }) => {
  const currval = value.map((v) => v?.id || v)
  const prevval = previousValue

  if (JSON.stringify(currval) !== JSON.stringify(prevval)) {
    const currentCategories = (originalDoc?.categories || []).reduce((a: string[], category) => {
      let path = ''
      ;(category?.breadcrumbs || []).forEach((crumb) => {
        path = `${path}/${format(crumb.label)}`
        a.push(JSON.stringify([crumb.doc, path]))
      })
      return a
    }, [])

    const postId = originalDoc?.id
    if (postId) {
      const tags = (originalDoc?.tags || []).reduce((h, tag) => {
        h[tag?.name] = true
        return h
      }, {})
      const featured = !!tags['featured']
      const recommended = !!tags['recommended']
      const standalone = originalDoc?.standalone
      await req.payload.db.drizzle.delete(categoriesPosts).where(eq(categoriesPosts.postId, postId))
      currentCategories.forEach(async (category: string) => {
        const [categoryId, categoryPath] = JSON.parse(category)
        await req.payload.db.drizzle.insert(categoriesPosts).values({
          categoryId,
          postId,
          categoryPath,
          featured,
          recommended,
          standalone,
        })
      })
    }
  }
}
