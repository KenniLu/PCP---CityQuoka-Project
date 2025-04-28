import React from 'react'
import { Metadata } from 'next'
import { fetchCachedPostBySlug } from '../../posts/[slug]/page'
import { fetchCategoryPathsForSlugs } from '@/utilities/fetchCategories'
import { generateMeta } from '@/utilities/generateMeta'
import Post from '@/components/Post'
import { CollectionHeroCarousel } from '@/components/CollectionHeroCarousel'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header } from '@/payload-types'
import PostTile from '@/components/PostTile'

import {
  fetchFeaturedPostsByCategoryPaths,
  fetchPostsByCategoryPaths,
} from '@/utilities/fetchPosts'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'

const CategoriesBreadCrumb = (
  paths: {
    title: string
    url: string
  }[],
) => {
  return (paths || []).length > 1 ? (
    <Breadcrumb>
      <BreadcrumbList>
        {(paths || []).map((crumb, indx) => (
          <React.Fragment key={`categoryPath${indx}}`}>
            {indx !== 0 && (
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem className="text-base text-blue-600">
              <BreadcrumbLink href={`/cityguide/${crumb.url}`}>{crumb.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  ) : <div></div>
}

export default async function CityGuidePage({ params }) {
  const { path } = await params
  if (path && path.at(-2) === 'posts' && !!path.at(-1)) {
    const post = await fetchCachedPostBySlug(path.at(-1))
    return <Post post={post} />
  }
  if (path && path.at(-1) === 'posts') {
    path.pop()
  }
  const header: Header = await getCachedGlobal('header', 1)()
  var showBreadCrumbs = false
  let categoryPaths: string[] = []
  if (!path || path?.length == 0) {
    categoryPaths = (header?.navItems || []).map((navItem) =>
      navItem.link.url?.replace(/\/cityguide/, ''),
    ) as string[]
  } else {
    categoryPaths = [`/${path?.join('/')}`]
    showBreadCrumbs = true
  }
  const paths = await fetchCategoryPathsForSlugs(path)

  const categoryFeaturedPosts = await fetchFeaturedPostsByCategoryPaths(categoryPaths)
  const categoryPosts = await fetchPostsByCategoryPaths(categoryPaths)
  return (
    <div className="self-center w-full max-w-[1122px] bg-white mx-auto flex flex-col gap-4">
      {showBreadCrumbs && CategoriesBreadCrumb(paths)}
      <CollectionHeroCarousel useNonHero={true} posts={categoryFeaturedPosts} />
      <div className="flex items-center w-full my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 px-4 py-1 font-medium bg-quokka-yellow rounded">
          More Posts in City Quokka
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryPosts.map((post, index) => (
            <PostTile post={post} key={`postTile${index}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { path } = await params
  const paths = path || ['city-guide']
  const formattedPaths = paths.map((str) =>
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  if (paths.at(-2) === 'posts' && !!paths.at(-1)) {
    const post = await fetchCachedPostBySlug(paths.at(-1))
    return generateMeta({ doc: post })
  } else {
    return {
      title: `City Quokka | ${paths.join(' | ')}`,
      description: `City Quokka - Explore more about ${paths.join(', ')}`,
    }
  }
}
