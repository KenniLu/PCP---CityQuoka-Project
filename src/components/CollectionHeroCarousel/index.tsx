import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Media } from '@/components/Media'

import type { Post, Media as MediaType } from '@/payload-types'
import { CMSLink } from '../Link'

export type Props = {
  useNonHero?: boolean
  posts: Partial<Post>[]
}

export const CollectionHeroCarousel: React.FC<Props> = (props) => {
  const { posts, useNonHero } = props

  const colour_lookups = ['quokka-green', 'quokka-yellow', 'quokka-purple']

  const heroImage = (image: MediaType, imageAlt: string) => (
    <div className="md:max-lg:w-3/5 sm:max-md:w-1/2 max-sm:w-full lg:h-[420px] flex-shrink-0">
      <Media
        className={'relative flex w-full justify-center h-full aspect-[3/2] max-h-[420px]'}
        priority
        imgClassName="object-cover object-center overflow-hidden rounded-md w-full h-full"
        resource={image}
        size={'(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 60vw, 630px'}
      />
    </div>
  )

  return (
    <div className="flex self-center w-full max-w-[1122px] bg-white mx-auto">
      <Carousel className="w-full max-w-[1122px] mx-auto">
        <CarouselContent>
          {posts.map((post, indx) => {
            const { image, hero_title, hero_subtitle, slug, hero_image, title, subTitle } = post

            return (
              <CarouselItem key={post.id}>
                <div className="flex max-sm:flex-col sm:max-md:flex-row md:flex-row">
                  {(image || hero_image) &&
                    heroImage((image || hero_image) as MediaType, post.title!)}
                  <div className="md:max-lg:w-2/5 sm:max-md:w-1/2 max-sm:w-full flex-col flex-1">
                    <div
                      className={`flex flex-col relative pt-6 pr-6 pb-6 pl-6 text-black bg-${colour_lookups[indx % 3]} rounded-md max-md:py-0 max-md:pl-0 max-md:pr-0 w-full h-full`}
                      style={{ maxHeight: '420px' }}
                    >
                      <div className="flex flex-col justify-between w-full h-full p-2">
                        <div
                          className={`text-black text-[25px] leading-[24px] tracking-[-0.75px] pb-2 flex flex-col max-md:text-left justify-center w-full bg-${colour_lookups[indx % 3]} `}
                        >
                          {hero_title && <div className="pt-2 md:pt-8 font-bold">{hero_title}</div>}
                          {!hero_title && useNonHero && title && (
                            <div className="pt-2 md:pt-8 font-bold">{title}</div>
                          )}

                          {hero_subtitle && hero_subtitle.length > 0 && (
                            <div className="text-black pt-2 text-lg">{hero_subtitle}</div>
                          )}
                          {!hero_subtitle && useNonHero && subTitle && subTitle.length > 0 && (
                            <div className="text-black pt-2 text-lg">{subTitle}</div>
                          )}
                        </div>
                        <div className="mt-auto self-end mr-8 max-md:mt-4 max-md:mr-0">
                          <CMSLink
                            className="flex w-[100px] h-[30px] p-[10px_16px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[6px] bg-white text-black font-semibold whitespace-nowrap text-sm"
                            type={'reference'}
                            reference={{ relationTo: 'posts', value: post as Post }}
                            label={'Learn More'}
                            appearance={'default'}
                          />
                        </div>
                      </div>
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
    </div>
  )
}
