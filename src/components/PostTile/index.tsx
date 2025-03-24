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
    <div className="p-2 bg-gray-100 w-[200px]">
      <CMSLink
        type={'reference'}
        reference={{ relationTo: 'posts', value: post as Post }}
        appearance={'inline'}
      >
        <div className="hover:cursor-pointer max-md:w-[180px]">
          {image && (
            <Media priority imgClassName="w-[200px] h-[150px] object-cover" resource={image} />
          )}
          {/* </div> */}
          <p className="tracking-tighter text-lg mt-2">{title}</p>
        </div>
      </CMSLink>
      {/* <hr className="mt-4 max-md:hidden" /> */}
      {/* <div className="md:border-l-0 md:border-t-2 h-auto md:h-0 md:w-full"></div> */}
      {/* </div> */}
    </div>
  )
}

export default PostTile
