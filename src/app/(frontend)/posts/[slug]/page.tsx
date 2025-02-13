import type { Metadata } from 'next'

// import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
// import PageClient from './page.client'
import { isRichTextEmpty } from '@/utilities/isRichTextEmpty'
import CategoriesBar from '@/components/CategoriesBar'
import PostGroupBlock from '@/components/PostGroupBlock'
import { RecommendedSideBar } from '@/components/RecommendedSideBar'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  const getListStyle = (listType: string) => {
    switch (listType) {
      case 'bulleted':
        return { listStyle: 'disc inside' }
      case 'numbered':
        return { listStyle: 'decimal inside' }
      default:
        return { listStyle: 'none' }
    }
  }

  const formatListPostTitle = (title: string, listType: string, index: number) => {
    switch (listType) {
      case 'bulleted':
        return `• ${title}`
      case 'numbered':
        return `${index}. ${title}`
      default:
        return title
    }
  }

  const postLinkSummary = (linkSummary, postSummary) => {
    if (isRichTextEmpty(linkSummary)) {
      if (isRichTextEmpty(postSummary)) {
        return null
      } else {
        return (
          <RichText
            className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
            content={postSummary}
            enableGutter={false}
          />
        )
      }
    } else {
      return (
        <RichText
          className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
          content={linkSummary}
          enableGutter={false}
        />
      )
    }
  }

  return (
    <article className="w-full">
      <PayloadRedirects disableNotFound url={url} />
      <div className="flex flex-col w-full px-8 sm:px-0">
        <CategoriesBar />
        {/* <PostHero post={post} /> */}
        <div className="w-full relative pb-10">
          <div className="w-full flex justify-center max-sm:hidden"></div>

          {/* My changes start */}
          <div className="flex flex-col md:flex-row w-full gap-4">
            {/* My changes end */}

            {/* <div className="max-w-[1120px] mx-auto px-4 max-sm:px-2"> */}
            <div className="w-full sm:max-w-[960px] mx-auto sm:min-w-0 p-4">
              {/* <article className="w-full max-w-[960px] max-md:w-full">
                <div className="w-full max-w-[960px] max-md:w-full"> */}
              <article className="w-full max-w-[960px]">
              <div className="w-full max-w-[960px]">
                  {/* <ArticleHeader />*/}
                  <PostHero post={post} />
                </div>
                {/* <div className="font-author text-2xl leading-[135%] tracking-[-0.9px] text-black text-justify mt-8 max-w-[960px] max-sm:max-w-[330px]"> */}
                <div className="font-author text-2xl leading-[135%] tracking-[-0.9px] text-black text-justify mt-8 max-w-[960px]">
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
            </div>

            {/* My changes start */}
            {/* My changes end */}

            {/* <aside className="absolute top-[180px] right-0 max-lg:relative max-lg:mt-8"> */}
            <aside className="top-0 right-0 w-full md:w-[320px] shrink-0 p-4">
              {/* <ArticleSidebar /> */}
              <RecommendedSideBar />
            </aside>

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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}
