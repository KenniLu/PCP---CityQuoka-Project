import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

// import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
// import ResponsiveImage from '@/components/ResponsiveImage'
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
      <div className="self-start mt-0 text-[40px] font-extrabold tracking-wider leading-[63px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
        {title}
      </div>
      {post.subTitle && post.subTitle.length > 0 && 
      <div className="mt-4 text-[30px] tracking-tight leading-10 text-neutral-500 w-[740px] max-lg:w-full">
        {post.subTitle}
      </div>
      }
      <div className="flex flex-wrap gap-5 justify-between mt-4 w-full leading-none max-md:max-w-full">
        <div className="text-base tracking-tight">Written by {joinWithAnd(authors)}</div>
        {/* <SocialActions /> */}
        <SocialActions postId={post.id}/>
      </div>
      {/* <div className="relative w-[956.701px] h-[444.354px] mt-4 max-lg:w-full max-lg:h-auto max-lg:aspect-[2.15]"> */}
      {/* <div className="relative h-[444.354px] mt-4 max-sm:w-full max-lg:h-auto max-lg:aspect-[2.15]"> */}
      {/* <div className="relative min-h-[35vh] md:min-h-[60vh] select-none"> */}
      <div className="relative min-h-[35vh] md:min-h-[60vh] select-none">
        {/* <img
          loading="lazy"
          src={exhibit}
          className="object-cover absolute inset-0 w-full h-full"
          alt="Article header image"
        /> */}
        {/* {image && (
          <ResponsiveImage
            media={image as MediaType}
            alt={post.title!}
            sizes="(max-width: 685px) 100vw, 685px"
            className="object-cover absolute inset-0 w-full h-full"
          />
        )} */}
        {/* {image && <Media fill priority imgClassName="object-cover absolute inset-0 w-full h-full" resource={image} />} */}
        {image && <Media fill priority imgClassName="object-cover" resource={image} />}

        <div className="relative px-3 py-0.5 inline-block rounded-md bg-zinc-300 text-xl tracking-tight leading-none text-neutral-500 mt-4">
          {formatDate(post.publishedAt!)}
        </div>
      </div>
    </div>
  )
}
