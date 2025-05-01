import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Post from '@/components/Post'
import { generateMeta } from '@/utilities/generateMeta'
import { unstable_cache } from 'next/cache';
import { fetchPostBySlug } from '@/utilities/fetchPosts'

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const posts = await payload.find({
//     collection: 'posts',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   })

//   const params = posts.docs.map(({ slug }) => {
//     return { slug }
//   })

//   return params
// }

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await fetchCachedPostBySlug(slug)

  if (!post) return <PayloadRedirects url={url} />
  return(<Post post={post}/>)

}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await fetchCachedPostBySlug(slug)

  return generateMeta({ doc: post })
}

export const fetchCachedPostBySlug = cache(async (slug) => {
  const { isEnabled: draft } = await draftMode()
  if(draft){
    return await fetchPostBySlug(slug, draft)
  }else{
    return await unstable_cache(fetchPostBySlug, [slug], {tags: [`post-${slug}`]})(slug, draft)
  }
});