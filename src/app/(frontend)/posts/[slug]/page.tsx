import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Post from '@/components/Post'
import { generateMeta } from '@/utilities/generateMeta'


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
  const post = await fetchPostBySlug(slug)

  if (!post) return <PayloadRedirects url={url} />
  return(<Post post={post}/>)

}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await fetchPostBySlug({ slug })

  return generateMeta({ doc: post })
}

export const fetchPostBySlug = cache(async (slug) => {
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
});