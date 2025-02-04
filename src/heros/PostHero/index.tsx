import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

// import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import ResponsiveImage from '@/components/ResponsiveImage'
import type { Post, Media as MediaType } from '@/payload-types'
import { auth } from '@/auth'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const {
    categories,
    image,
    meta: { image: metaImage } = {},
    populatedAuthors,
    publishedAt,
    title,
  } = post

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${weekday} ${day} ${month} ${year}`;
  };

  const authors = (populatedAuthors || []).map((author) => author.name || '')

  const joinWithAnd = (items: string[]): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    
    const allButLast = items.slice(0, -1);
    const lastItem = items[items.length - 1];
    
    return `${allButLast.join(', ')} and ${lastItem}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-8">
      <div className="container">
        {image && <ResponsiveImage
          media={image as MediaType}
          alt={post.title!}
          sizes="(max-width: 685px) 100vw, 685px"
        />}
        <hr className="mt-3 mb-3"/>
        <div className="text-black text-[25px] font-author font-bold leading-[33.25px] tracking-[-1.05px] uppercase pb-4 flex justify-between items-center w-full">
          <div className="flex-1">{post.title}</div>
        </div>
        {formatDate(post.publishedAt!)}
        <br/>
        Written by {joinWithAnd(authors)}
      </div>
    </div>
    // <h1></h1>
    // <div className="relative -mt-[10.4rem] flex items-end">
    //   <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
    //     <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
    //       <div className="uppercase text-sm mb-6">
    //         {categories?.map((category, index) => {
    //           if (typeof category === 'object' && category !== null) {
    //             const { title: categoryTitle } = category

    //             const titleToUse = categoryTitle || 'Untitled category'

    //             const isLast = index === categories.length - 1

    //             return (
    //               <React.Fragment key={index}>
    //                 {titleToUse}
    //                 {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
    //               </React.Fragment>
    //             )
    //           }
    //           return null
    //         })}
    //       </div>

    //       <div className="">
    //         <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
    //       </div>

    //       <div className="flex flex-col md:flex-row gap-4 md:gap-16">
    //         <div className="flex flex-col gap-4">
    //           {populatedAuthors && (
    //             <div className="flex flex-col gap-1">
    //               <p className="text-sm">Author</p>
    //               {populatedAuthors.map((author, index) => {
    //                 const { name } = author

    //                 const isLast = index === populatedAuthors.length - 1
    //                 const secondToLast = index === populatedAuthors.length - 2

    //                 return (
    //                   <React.Fragment key={index}>
    //                     {name}
    //                     {secondToLast && populatedAuthors.length > 2 && (
    //                       <React.Fragment>, </React.Fragment>
    //                     )}
    //                     {secondToLast && populatedAuthors.length === 2 && (
    //                       <React.Fragment> </React.Fragment>
    //                     )}
    //                     {!isLast && populatedAuthors.length > 1 && (
    //                       <React.Fragment>and </React.Fragment>
    //                     )}
    //                   </React.Fragment>
    //                 )
    //               })}
    //             </div>
    //           )}
    //         </div>
    //         {publishedAt && (
    //           <div className="flex flex-col gap-1">
    //             <p className="text-sm">Date Published</p>

    //             <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="min-h-[80vh] select-none">
    //     {metaImage && typeof metaImage !== 'string' && (
    //       <Media fill imgClassName="-z-10 object-cover" resource={metaImage} />
    //     )}
    //     <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
    //   </div>
    // </div>
  )
}
