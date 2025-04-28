import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
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
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/posts/${previousDoc.slug}`

    payload.logger.info(`Revalidating old post at path: ${oldPath}`)

    revalidatePath(oldPath)
    tagsToRevalidate.push(`post-${previousDoc.slug}`)
  }
  [...new Set(tagsToRevalidate)].forEach((tag) => revalidateTag(tag))
  return doc
}
