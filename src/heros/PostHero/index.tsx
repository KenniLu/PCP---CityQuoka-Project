import React from 'react'
import { Media } from '@/components/Media'
import type { Post, Media as MediaType } from '@/payload-types'
import SocialActions from '@/blocks/PostEntrySocialActions'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const {
    categories,
    image,
    meta: { image: metaImage } = {},
    populatedAuthors,
    publishedAt,
    title,
  } = post

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)

    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()

    return `${weekday} ${day} ${month} ${year}`
  }

  const authors = (populatedAuthors || []).map((author) => author.name || '')

  const joinWithAnd = (items: string[]): string => {
    if (items.length === 0) return ''
    if (items.length === 1) return items[0]

    const allButLast = items.slice(0, -1)
    const lastItem = items[items.length - 1]

    return `${allButLast.join(', ')} and ${lastItem}`
  }

  return (
    <div className="flex flex-col py-0.5 mt-4 w-full text-black font-inter max-md:mt-10 max-md:max-w-full">
      <div className="text-3xl md:text-4xl font-bold leading-tight md:leading-snug tracking-normal text-gray-900 mb-4">
        {title}
      </div>
      {post.subTitle && post.subTitle.length > 0 && (
        <div className="text-2xl md:text-3xl tracking-normal leading-tight md:leading-snug text-neutral-500">
          {post.subTitle}
        </div>
      )}
      <div className="flex flex-wrap gap-5 justify-between mt-4 w-full leading-none max-md:max-w-full">
        <div className="text-base tracking-tight">
          <div className="flex flex-col gap-1">
            <p
              className="text-base font-bold"
              style={{ display: authors.length === 0 ? 'none' : 'block' }}
            >
              Written by {joinWithAnd(authors)}
            </p>
            <p className="text-base">{formatDate(post.publishedAt!)}</p>
          </div>
        </div>
        <SocialActions postId={post.id} />
      </div>
      <div className="relative w-full aspect-[3/2] select-none md:mt-1">
        {image && (
          <Media
            fill
            priority={true}
            fetchPriority={'high'}
            imgClassName="object-cover"
            resource={image}
            size="(max-width: 767px) 100vw, (max-width: 1020px) 622px, (max-width: 1280px) 741px, 862px"
          />
        )}
      </div>
    </div>
  )
}
