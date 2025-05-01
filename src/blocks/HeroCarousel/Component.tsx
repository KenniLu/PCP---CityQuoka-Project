import type { HeroCarouselBlock as HeroCarouselBlockProps } from '@/payload-types'
import React from 'react'
import { fetchHeroPosts } from '@/utilities/fetchPosts'
import { CollectionHeroCarousel } from '@/components/CollectionHeroCarousel'

export const HeroCarouselBlock: React.FC<HeroCarouselBlockProps> = async (props) => {
  const { limit: limitFromProps } = props

  const limit = limitFromProps || 3

  const posts = await fetchHeroPosts(limit)
  return <CollectionHeroCarousel posts={posts} />
}
