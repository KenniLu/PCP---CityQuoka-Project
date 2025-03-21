import React from 'react'
// import Image from 'next/image'
import type { Post, Media as MediaType } from '@/payload-types'
import RichText from '@/components/RichText'
import { isRichTextEmpty } from '@/utilities/isRichTextEmpty'
// import ResponsiveImage from '@/components/ResponsiveImage'
import { Media } from '@/components/Media'
import SocialActions from '@/blocks/PostEntrySocialActions'
import { CMSLink } from '../Link'

interface PostGroupEntryProps {
  postLink: any
  index: number
  listType: string
  useSeparator: boolean
}

const PostGroupEntry = ({ postLink, index, listType, useSeparator }: PostGroupEntryProps) => {
  const { post, content: linkSummary } = postLink.postLink
  const { title, summary: postSummary, image } = post as Post

  const formatListPostTitle = (listType: string, index: number) => {
    switch (listType) {
      case 'bulleted':
        // return `• ${title}`
        return (
          <span className="text-2xl text-[#585858] leading-[128%] tracking-[-1.5px] text-justify capitalize">
            &bull;&nbsp;{' '}
          </span>
        )
      case 'numbered':
        // return `${index}. ${title}`
        return (
          <span className="text-[#585858] leading-[128%] tracking-[-1.5px] text-justify capitalize">
            {index}.&nbsp;{' '}
          </span>
        )
      default:
        return null
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
    <>
      {useSeparator && (
        <>
          <div className="h-[50px]"></div>
          <div className="w-full h-[4px] bg-[#EFEFEF] max-w-[300px] mx-auto sm:max-w-[300px]"></div>
        </>
      )}
      {/* <div className="mt-12 max-w-full w-full px-4 sm:px-6 lg:px-12"> */}
      <div className="mt-2 xl:mt-4 max-w-full w-full">
        <div className="flex gap-5 flex-col-reverse xl:flex-row">
          <div className="flex flex-col w-full xl:w-6/12">
            <div className="flex flex-col grow mt-2 xl:mt-10">
              {/* <div className="tracking-tighter leading-8 text-black"> */}
              <div className="leading-8 text-black">
                {/* {formatListPostTitle(listType, index)} */}
                {/* <span className="inline-block w-full lg:w-[346.605px] h-[44px] flex-shrink-0 rounded-[6px] bg-[#EBEBEB] px-2 py-1"> */}
                <span className="inline-block w-full lg:w-[346.605px] h-[44px] flex-shrink-0 py-1 text-2xl font-bold">
                  {formatListPostTitle(listType, index)}
                  {title}
                </span>
                <br />
                <div className="mt-2">{postLinkSummary(linkSummary, postSummary)}</div>
              </div>
              {post.standalone && (
                <div className="mt-8">
                  <CMSLink
                    className="px-6 py-2 bg-quokka-yellow text-black rounded-lg hover:bg-[#E69D00] text-lg"
                    type={'reference'}
                    reference={{ relationTo: 'posts', value: post as Post }}
                    label={'Read More'}
                    appearance={'default'}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col mt-5 lg:mt-0 lg:ml-5 w-full xl:w-6/12">
            <div className="flex flex-col self-stretch w-full leading-none text-black items-end">
              <div className="flex justify-end mb-1 mr-auto xl:mr-0">
                <SocialActions postId={post.id} />
              </div>
              <div className="relative flex flex-col items-start pt-2 pb-72 mt-1 w-full text-xl tracking-tight rounded-md min-h-[320px] max-w-full">
                {image && (
                  // <ResponsiveImage
                  //   media={image as MediaType}
                  //   alt={post.title!}
                  //   sizes="(max-width: 685px) 100vw, 685px"
                  //   className="object-cover absolute inset-0 w-full h-full"
                  // />
                  <Media
                    fill
                    priority
                    className="object-cover absolute inset-0 w-full h-full"
                    resource={image}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostGroupEntry
