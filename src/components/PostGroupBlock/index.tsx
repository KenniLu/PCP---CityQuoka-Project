import React from 'react'
import PostGroupEntry from '../PostGroupEntry'

interface PostGroupBlockProps {
  content: any
}

const PostGroupBlock = ({ content }: PostGroupBlockProps) => {
  const { listType, useSeparator } = content
  return (
    <div>
      <article className="max-md:w-full max-lg:ml-0">
        {(content.postLinks || []).map((postLink, index) => (
          <div
            key={`PostIndex${index}`}
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
