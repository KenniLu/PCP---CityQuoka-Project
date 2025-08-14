import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { fetchCachedProviderBySlug, fetchLocationsByProvider } from '@/utilities/fetchProviders'
import ProviderPage from '@/components/Provider'

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    search?: string
  }>
}

export default async function ProviderSlugPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { slug = '' } = await paramsPromise
  const { search } = await searchParamsPromise
  const url = '/providers/' + slug
  const provider = await fetchCachedProviderBySlug(slug)

  if (!provider) return <PayloadRedirects url={url} />

  const locations = await fetchLocationsByProvider(provider.id, search)

  return <ProviderPage provider={provider} locations={locations} searchQuery={search} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const provider = await fetchCachedProviderBySlug(slug)

  return {
    title: `City Quokka - ${provider?.name}`,
    description: provider?.description,
    // openGraph: mergeOpenGraph({
    //   description: doc?.meta?.description || '',
    //   images: ogImage
    //     ? [
    //         {
    //           url: ogImage,
    //         },
    //       ]
    //     : undefined,
    //   title,
    //   url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    // }),
    // title,
  }
}
