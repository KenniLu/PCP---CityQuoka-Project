import type { Category, Post } from '@/payload-types'
import findLongestArray from './findLongestArray'
import { format } from '@/hooks/formatSlug'

export default function calculatePostLink(post: Post): string | null {
  const categoryPaths = (post?.categories || []).map((cat: Category) =>
    (cat?.breadcrumbs || []).map((crumb) => crumb.label),
  )
  const longestCategoryPath = findLongestArray(categoryPaths)
  if (!longestCategoryPath) {
    return null
  } else {
    return `/cityguide/${longestCategoryPath.map((category) => format(category!)).join('/')}/posts/${post.slug}`
  }
}
