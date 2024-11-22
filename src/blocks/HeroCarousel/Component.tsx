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
      title: true,
      hero_title: true,
      hero_subtitle: true,
      image: true
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

  return (
    <div className="my-16" id={`block-${id}`}>
      {/* {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
        </div>
      )} */}
      <CollectionHeroCarousel posts={posts} />
    </div>
  )
}
