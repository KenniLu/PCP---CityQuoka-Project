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
import PageClient from './page.client'
import { isRichTextEmpty } from '@/utilities/isRichTextEmpty'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
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
        return { listStyle: 'disc inside' };
      case 'numbered':
        return { listStyle: 'decimal inside' };
      default:
        return { listStyle: 'none' };
    }
  };

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
    if(isRichTextEmpty(linkSummary)){
      if(isRichTextEmpty(postSummary)){
        return null
      }else{
        return(<RichText
          className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
          content={postSummary}
          enableGutter={false}
        />)
      }
    }else{
      return(<RichText
        className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
        content={linkSummary}
        enableGutter={false}
      />)
    }
  }

  return (
    <article>
      <PageClient />
      {/* {JSON.stringify(post)} */}
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          {
            post.content?.map((content, i) => {
              if(content.blockType === 'PostContentBlock'){
                return(<RichText
                  key={`content_tab_${i}`}
                  className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
                  content={content.content}
                  enableGutter={false}
                />)
              }else if(content.blockType === 'PostGroupBlock'){
                const {listType, useSeparator} = content
                return(<div key={`content_x_${i}`}>
                  {(content.postLinks||[]).map((postLink, i)=>{
                      const isLastItem = i === (content.postLinks || []).length - 1
                      const {post, content: linkSummary} = postLink.postLink
                      const { title, summary: postSummary} = post as Post
                          return(<div key={`postLink${i}`}>
                          <div>{formatListPostTitle(title, listType!, i+1)}</div>
                          <div>
                            {postLinkSummary(linkSummary, postSummary)}
                          </div>
                          {useSeparator && !isLastItem && <hr />}
                          {!useSeparator && !isLastItem && <div className="h-4" />}
                        </div>)
                  })}
                </div>)
              }
            })
          }
        </div>
        {/* {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts
            className="mt-12"
            docs={post.relatedPosts.filter((post) => typeof post === 'object')}
          />
        )} */}
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
