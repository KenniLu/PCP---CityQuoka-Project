import type { Post, Media as MediaType } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
// import ResponsiveImage from '@/components/ResponsiveImage'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export const RecommendedSideBar: React.FC = async () => {
  let posts: Partial<Post>[] = []
  const limit = 4

  const payload = await getPayload({ config: configPromise })

  const fetchedPosts = await payload.find({
    collection: 'posts',
    select: {
      id: true,
      title: true,
      // hero_title: true,
      // hero_subtitle: true,
      // hero_image: true,
      image: true,
      slug: true,
    },
    depth: limit,
    limit,
    where: {
      'tags.name': {
        in: ['hero'],
      },
    },
  })

  posts = fetchedPosts.docs

  return (
    // <aside className="w-[320px] max-md:w-full hidden lg:block">
    <aside className="w-[320px] max-md:w-full">
      <div className="relative bg-[#FFC53D] rounded-md pt-12 px-9 pb-14">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4">
          <div className="px-3 py-2 bg-white rounded-lg border-black border-solid border-[3px] font-bold font-inter text-lg">
            Recommended
          </div>
        </div>
        <div className="space-y-8">
          {posts.map((post, index) => {
            const { title, image } = post
            return (
              <div key={index}>
                <CMSLink
                  type={'reference'}
                  reference={{ relationTo: 'posts', value: post as Post }}
                  appearance={'inline'}
                >
                  <div className="hover:cursor-pointer">
                    <p className="tracking-tighter text-lg mb-4">{title}</p>
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
                  </div>
                </CMSLink>
                <hr className="mt-4" />
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
