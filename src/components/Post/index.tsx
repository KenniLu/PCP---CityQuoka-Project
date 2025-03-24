import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import PageClient from './PageClient'
import PostGroupBlock from '@/components/PostGroupBlock'
import { RecommendedSideBar } from '@/components/RecommendedSideBar'

type Args = {
  post: Post
}

export default async function Post({ post }: Args) {

  const postIds = [post.id]

  ;(post.content || []).forEach((content) => {
    if (content.blockType === 'PostGroupBlock') {
      ;(content.postLinks || []).forEach((postLink) => {
        const _post = postLink.postLink.post as Post
        postIds.push(_post.id)
      })
    }
  })

  return (
    <article className="w-full">
      <div className="flex flex-col w-full px-2">
        {/* <PostHero post={post} /> */}
        <div className="w-full relative pb-10">
          <div className="w-full flex justify-center max-sm:hidden"></div>

          {/* My changes start */}
          <div className="flex flex-col md:flex-row w-full gap-4">
            {/* My changes end */}

            {/* <div className="max-w-[1120px] mx-auto px-4 max-sm:px-2"> */}
            <div className="w-full sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-3">
              {/* <article className="w-full max-w-[960px] max-md:w-full">
                <div className="w-full max-w-[960px] max-md:w-full"> */}
              <PageClient postIds={postIds}>
                <article className="w-full max-w-5xl">
                  <div className="w-full max-w-5xl">
                    {/* <ArticleHeader />*/}
                    <PostHero post={post} />
                  </div>
                  {/* <div className="font-author text-2xl leading-[135%] tracking-[-0.9px] text-black text-justify mt-8 max-w-[960px] max-sm:max-w-[330px]"> */}
                  <div className="text-xl leading-[135%] text-justify mt-8 max-w-[960px] flex flex-col gap-4">
                    {post.content?.map((content, i) => {
                      if (content.blockType === 'PostContentBlock') {
                        return (
                          <RichText
                            key={`content_tab_${i}`}
                            className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
                            content={content.content}
                            enableGutter={false}
                          />
                        )
                      } else if (content.blockType === 'PostGroupBlock') {
                        return <PostGroupBlock content={content} key={`content_x_${i}`} />
                      }
                    })}
                  </div>
                </article>
              </PageClient>
              <RecommendedSideBar />
            </div>

            {/* My changes start */}
            {/* My changes end */}

            {/* <aside className="absolute top-[180px] right-0 max-lg:relative max-lg:mt-8"> */}
            {/* <aside className="top-0 right-0 w-full md:w-[320px] shrink-0 p-4">
              <RecommendedSideBar />
            </aside> */}

            {/* My changes start */}
          </div>
          {/* My changes end */}

          <div className="h-[30px]"></div>
          <div className="w-full h-[4px] bg-[#EFEFEF] max-w-[300px] mx-auto sm:max-w-[300px]"></div>
        </div>
      </div>
    </article>
  )
}