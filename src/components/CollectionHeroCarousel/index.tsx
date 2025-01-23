import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import ResponsiveImage from '../ResponsiveImage'
import type { Post, Media as MediaType } from '@/payload-types'
import { CMSLink } from '../Link'

export type Props = {
  posts: Partial<Post>[]
}

export const CollectionHeroCarousel: React.FC<Props> = (props) => {
  const { posts } = props

  const colour_lookups = ['quokka-green', 'quokka-yellow', 'quokka-purple']

  return (
    <Carousel className="w-full max-w-[1122px] mx-auto">
      <CarouselContent>
        {posts.map((post, indx) => {
          const { image, hero_title, hero_subtitle, slug, hero_image } = post
          return (
            <CarouselItem key={post.id}>
              <div className="flex self-center w-full bg-white">
                  { hero_image ?  <ResponsiveImage
                    media={hero_image as MediaType}
                    alt={post.title!}
                    sizes="(max-width: 685px) 100vw, 685px"
                  /> : <ResponsiveImage
                  media={image as MediaType}
                  alt={post.title!}
                  sizes="(max-width: 685px) 100vw, 685px"
                />
                }
                <div className="flex flex-col ml-auto max-md:w-full max-md:px-5">
                  <div
                    className={`flex flex-col items-start pt-28 pr-1 pb-56 pl-12 ml-auto text-black bg-${colour_lookups[indx % 3]} rounded-md max-md:py-24 max-md:pl-5 max-md:max-w-full w-[440px] h-[543px]`}
                  >
                    <div className="flex-col">
                      <div className="text-black text-[25px] font-author font-bold leading-[33.25px] tracking-[-1.05px] uppercase pb-4 flex justify-between items-center w-full">
                        <div className="flex-1">{hero_title}</div>
                      </div>
                      {hero_subtitle && hero_subtitle.length > 0 && (
                        <div className="text-black text-[25px] font-author leading-[33.25px] tracking-[-1.05px] pb-4 flex justify-between items-center w-full">
                          <div className="flex-1">{hero_subtitle}</div>
                        </div>
                      )}
                    </div>
                    <CMSLink
                      className="flex w-[112.32px] h-[36px] p-[14.009px_22.415px] justify-center items-center gap-[14.009px] flex-shrink-0 rounded-[6px] bg-white text-black font-semibold whitespace-nowrap"
                      type={'reference'}
                      reference={{ relationTo: 'posts', value: post as Post }}
                      label={'Learn More'}
                      appearance={'default'}
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2" />
      <CarouselNext className="absolute right-4 top-1/2" />
    </Carousel>
  )
}
