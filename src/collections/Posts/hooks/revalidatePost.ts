import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, FieldHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Category, Post } from '../../../payload-types'
import { getNameSpacedTable } from '@/utilities/getNameSpacedTable'
import { format } from '@/hooks/formatSlug'

export const loadCurrentPublishedPost: CollectionBeforeChangeHook<Post> = async ({
  data,
  originalDoc,
  operation,
  req,
  context,
  collection,
}) => {
  if (operation === 'update' && data._status === 'published') {
    // Post is being published. read the current published version in the context to compare in the hooks below
    const previousPublished = await req.payload.findByID({
      id: originalDoc?.id!,
      collection: collection.slug,
      select: {
        id: true,
        title: true,
        hero_title: true,
        hero_subtitle: true,
        hero_image: true,
        image: true,
        slug: true,
        categories: true,
        hero: true,
        standalone: true,
        featured: true,
      },
      depth: 0,
      draft: false,
      disableErrors: true,
    })
    context.previousPublished = previousPublished
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  req: { payload, query },
  context,
}) => {
  const tagsToRevalidate: string[] = []
  // Ignore autosave and drafts
  if (query.draft === 'true' || query.autosave === 'true') {
    return doc
  }

  if (doc._status === 'published') {
    const previousPublished = context.previousPublished as { [key: string]: unknown }

    const path = `/posts/${doc.slug}`
    revalidatePath(path)
    tagsToRevalidate.push(`post-${doc.slug}`)
    if (doc.hero || previousPublished?.hero) {
      tagsToRevalidate.push('hero-posts')
    }

    // Revalidating parent posts if this post is part of any parent's posticles
    const postsTable = getNameSpacedTable(payload, 'posts')
    const groupBlockTable = getNameSpacedTable(payload, 'posts_blocks_post_group_block')
    const groupBlockPostLinkTable = getNameSpacedTable(
      payload,
      'posts_blocks_post_group_block_post_links',
    )
    const parentPosts = await payload.db.execute({
      drizzle: payload.db.drizzle,
      raw: `select p.slug from ${postsTable} p
      inner join ${groupBlockTable} gb on gb._parent_id = p.id
      inner join ${groupBlockPostLinkTable} gbpl on gbpl._parent_id = gb.id
      where gbpl.post_link_post_id = ${doc.id}`,
    })

    tagsToRevalidate.push(...parentPosts.rows.map((row) => `post-${row.slug}`))
    if (previousPublished.slug !== doc.slug) {
      const oldPath = `/posts/${previousPublished.slug}`
      revalidatePath(oldPath)
      tagsToRevalidate.push(`post-${previousPublished.slug}`)
    }

    const previousPublishedCategoryIds = (previousPublished?.categories as number[]) || []
    const currentCategoryIds = (doc.categories as number[]) || []
    const categoriesIdsToInvalidate = [
      ...new Set([...previousPublishedCategoryIds, ...currentCategoryIds]),
    ]

    const categories = await payload.find({
      collection: 'categories',
      where: {
        id: {
          in: categoriesIdsToInvalidate,
        },
      },
    })
    categories.docs.forEach((category: Category) => {
      let path: string = ''
      ;(category?.breadcrumbs || []).forEach((crumb) => {
        path = `${path}/${format(crumb.label!)}`
        if (previousPublished.featured || doc.featured) {
          tagsToRevalidate.push(`category-featured-${path}`)
        }
        tagsToRevalidate.push(`category-posts-${path}`)
      })
    })
  }

  ;[...new Set(tagsToRevalidate)].forEach((tag) => revalidateTag(tag))

  return doc
}
