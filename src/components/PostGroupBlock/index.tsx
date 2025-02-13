import React from 'react'
import Image from 'next/image'
import type { Post } from '@/payload-types'
import PostGroupEntry from '../PostGroupEntry'

interface PostGroupBlockProps {
  content: any
}

const PostGroupBlock = ({ content }: PostGroupBlockProps) => {
  const { listType, useSeparator } = content
  return (
    // <div className="max-w-[1120px] mx-auto px-4 max-sm:px-2">
    <div className="max-w-[1120px] mx-auto">
      {/* <article className="w-[960px] max-md:w-full -ml-[125px] max-lg:ml-0"> */}
      <article className="max-md:w-full max-lg:ml-0">
        {(content.postLinks || []).map((postLink, index) => (
          // {articlesData.map((article, index) => (
          <div
            key={`PostIndex${index}`}
            // className={`${
            //   index >= 2 ? "max-md:hidden" : "block"
            // }`}
          >
            <PostGroupEntry
              postLink={postLink}
              index={index + 1}
              listType={listType}
              useSeparator={useSeparator}
            />
          </div>
        ))}
      </article>
    </div>
  )
}

export default PostGroupBlock
