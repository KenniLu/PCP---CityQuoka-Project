import type { CollectionAfterChangeHook, FieldHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Category, Post } from '../../../payload-types'
import { getNameSpacedTable } from '@/utilities/getNameSpacedTable'
import { format } from '@/hooks/formatSlug'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const tagsToRevalidate: string[] = []
  if (doc._status === 'published') {
    const path = `/posts/${doc.slug}`

    payload.logger.info(`Revalidating post at path: ${path}`)

    revalidatePath(path)
    tagsToRevalidate.push(`post-${doc.slug}`)
    if (doc.hero || previousDoc.hero) {
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
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/posts/${previousDoc.slug}`

    payload.logger.info(`Revalidating old post at path: ${oldPath}`)

    revalidatePath(oldPath)
    tagsToRevalidate.push(`post-${previousDoc.slug}`)
  }

  ;[...new Set(tagsToRevalidate)].forEach((tag) => revalidateTag(tag))

  return doc
}

export const invalidateCategoryPosts: FieldHook = async ({
  value,
  previousValue,
  req,
}) => {
  const currval = value.map((v) => v?.id || v)
  const prevval = previousValue

  if (JSON.stringify(currval) !== JSON.stringify(prevval)) {
    const tagsToRevalidate: string[] = []
    const allCategoryIds = [...new Set([...currval, ...prevval])]
    const categories = await req.payload.find({
      collection: 'categories',
      where: {
        id: {
          in: allCategoryIds,
        },
      },
    })
    categories.docs.forEach((category: Category) => {
      let path: string = ''
      ;(category?.breadcrumbs || []).forEach((crumb) => {
        path = `${path}/${format(crumb.label!)}`
        tagsToRevalidate.push(`category-featured-${path}`, `category-posts-${path}`)
      })
    })
    ;[...new Set(tagsToRevalidate)].forEach((tag) => revalidateTag(tag))
  }
}
