import type { Post } from '@/payload-types'
import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type PostTileProps = {
  post: Partial<Post>
}

export const PostTile: React.FC<PostTileProps> = async ({ post }) => {
  const { title, image } = post
  return (
    <div className="p-2 bg-gray-100 w-[200px] h-full">
      <CMSLink
        type={'reference'}
        reference={{ relationTo: 'posts', value: post as Post }}
        appearance={'inline'}
      >
        <div className="hover:cursor-pointer max-md:w-[180px]">
          {image && (
            <Media priority={false} imgClassName="w-[200px] aspect-[3/2] object-cover" resource={image} size="184px" maxWidth={368}/>
          )}
          <p className="tracking-tighter text-lg mt-2">{title}</p>
        </div>
      </CMSLink>
    </div>
  )
}

export default PostTile
