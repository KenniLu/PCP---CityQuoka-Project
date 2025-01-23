import type { Post, HeroCarouselBlock as HeroCarouselBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
// import RichText from '@/components/RichText'

import { CollectionHeroCarousel } from '@/components/CollectionHeroCarousel'

export const HeroCarouselBlock: React.FC<
  HeroCarouselBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, limit: limitFromProps } = props

  const limit = limitFromProps || 3

  let posts: Partial<Post>[] = []

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
    },
    depth: 3,
    limit,
    where: {
      'tags.name': {
        in: ['hero'],
      },
    },
  })

  posts = fetchedPosts.docs

  return <CollectionHeroCarousel posts={posts} />
}
