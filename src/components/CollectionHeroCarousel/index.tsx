import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Media } from '@/components/Media'

// import ResponsiveImage from '../ResponsiveImage'
import type { Post, Media as MediaType } from '@/payload-types'
import { CMSLink } from '../Link'

export type Props = {
  posts: Partial<Post>[]
}

export const CollectionHeroCarousel: React.FC<Props> = (props) => {
  const { posts } = props

  const colour_lookups = ['quokka-green', 'quokka-yellow', 'quokka-purple']

  const heroImage = (image: MediaType, imageAlt: string) => (
    <div className="w-3/5 md:w-3/5 max-md:w-full flex flex-col h-64 sm:h-64 md:h-96 lg:h-128">
    {/* // <div className="w-3/5 max-md:w-full flex flex-col h-64 sm:h-64 md:h-96 lg:h-128"> */}
      <Media
        // fill
        className={'relative flex w-full aspect-video justify-center h-full'}
        priority
        imgClassName="object-cover object-center overflow-hidden rounded-md w-full h-full max-md:w-full max-md:h-full"
        resource={image}
      />
    </div>
  )

  return (
    // <div className="flex self-center w-full max-w-[1122px] bg-white pt-16 p-4 mx-auto">
    <div className="flex self-center w-full max-w-[1122px] bg-white mx-auto">
      <Carousel className="w-full max-w-[1122px] mx-auto">
        <CarouselContent>
          {posts.map((post, indx) => {
            const { image, hero_title, hero_subtitle, slug, hero_image } = post

            return (
              <CarouselItem key={post.id}>
                <div className="flex flex-row max-md:flex-col">
                  {(image || hero_image) &&
                    heroImage((image || hero_image) as MediaType, post.title!)}
                  {/* <div className="flex-1 flex-col ml-auto max-md:w-full flex-grow"> */}
                  <div className="w-2/5 md:w-2/5 max-md:w-full flex-col">
                    <div
                      // className="flex flex-col relative pt-6 pr-6 pb-6 pl-6 text-black bg-red-500 rounded-md max-md:py-0 max-md:pl-0 max-md:pr-0 w-full h-full"
                      className={`flex flex-col relative pt-6 pr-6 pb-6 pl-6 text-black bg-${colour_lookups[indx % 3]} rounded-md max-md:py-0 max-md:pl-0 max-md:pr-0 w-full h-full`}
                      style={{ maxHeight: '420px' }}
                    >
                      <div className="flex flex-col justify-between w-full h-full p-2">
                        {/* <div className="text-black text-[25px] font-author font-bold leading-[24px] tracking-[-0.75px] uppercase pb-2 flex flex-col items-center justify-center w-full text-center max-md:text-left"> */}
                        {/* <div className="text-black text-[25px] leading-[24px] tracking-[-0.75px] pb-2 flex flex-col max-md:text-left items-center justify-center w-full text-center"> */}
                        <div
                          className={`text-black text-[25px] leading-[24px] tracking-[-0.75px] pb-2 flex flex-col max-md:text-left justify-center w-full bg-${colour_lookups[indx % 3]} `}
                        >
                          {/* Added max-md:text-left */}
                          <div className="pt-2 md:pt-8 font-bold">{hero_title}</div>
                          {hero_subtitle && hero_subtitle.length > 0 && (
                            // <div className="text-black text-[25px] font-author leading-[33.25px] tracking-[-1.05px] pb-4 flex justify-between items-center w-full text-center max-md:text-left">
                            <div className="text-black pt-2 text-lg">
                              {/* <div className="sm:pt-40">{hero_subtitle}</div> */}
                              {hero_subtitle}
                            </div>
                          )}
                        </div>
                        <div className="mt-auto self-end mr-8 max-md:mt-4 max-md:mr-0">
                          {/* Correct "Learn More" alignment */}
                          {/* <button className="flex w-[100px] h-[30px] p-[10px_16px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[6px] bg-white text-black font-semibold whitespace-nowrap text-sm">
                          Learn More
                        </button> */}
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
