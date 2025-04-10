import type { Post } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PostTile from '@/components/PostTile'

export const RecommendedSideBar: React.FC = async () => {
  let posts: Partial<Post>[] = []
  const limit = 4

  const payload = await getPayload({ config: configPromise })

  const fetchedPosts = await payload.find({
    collection: 'posts',
    select: {
      id: true,
      title: true,
      image: true,
      slug: true,
    },
    depth: 1,
    limit,
    where: {
      hero: {
        equals: true,
      }
    },
  })

  posts = fetchedPosts.docs

  return (
    <aside className="w-[320px] max-md:w-full mt-4 md:mt-12">
      <div className="relative bg-[#FFC53D] rounded-md pt-12 px-4 pb-14">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4">
          <div className="px-3 py-2 bg-white rounded-lg border-black border-solid border-[3px] font-bold font-inter text-lg">
            Recommended
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 justify-items-center place-content-center">
          {posts.map((post, index) => {
            return (
              <PostTile post={post} key={`postTile${index}`}/>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
