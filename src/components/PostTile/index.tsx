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
          <div className="h-[156px] bg-zinc-300 w-full">
            {image && (
              // <ResponsiveImage
              //   media={image as MediaType}
              //   alt={title!}
              //   sizes="(max-width: 500px) 100vw, 500px"
              //   // className="object-contain inset-0 w-full h-full"
              //   className="object-cover object-center overflow-hidden w-full h-full"
              // />
              <Media
                // fill
                // priority
                className="object-cover object-center overflow-hidden w-full h-full"
                resource={image}
              />
            )}
          </div>
          <p className="tracking-tighter text-lg">{title}</p>
        </div>
      </CMSLink>
      {/* <hr className="mt-4 max-md:hidden" /> */}
      <div className="border-l-2 border-[#EFEFEF] md:border-l-0 md:border-t-2 h-auto md:h-0 md:w-full"></div>
      {/* </div> */}
    </div>
  )
}


export default PostTile