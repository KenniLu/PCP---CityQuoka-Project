import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'

import type { Props as MediaProps } from '../types'

import cssVariables from '@/cssVariables'

const { breakpoints } = cssVariables

const getMaxDimensionsFromSizes = (sizes: string) => {
  // Split the sizes string into individual rules
  const rules = sizes.split(',').map(rule => rule.trim());
  
  // Calculate the width for each rule
  const calculatedWidths = rules.map(rule => {
    // Handle percentage of viewport width case: "(max-width: 639px) 100vw"
    const viewportMatch = rule.match(/\(max-width:\s*(\d+)px\)\s*(\d+)vw/);
    if (viewportMatch) {
      const [, maxViewportWidth, viewportPercentage] = viewportMatch;
      // Calculate the actual width: percentage * viewport width
      return Math.round(Number(maxViewportWidth) * Number(viewportPercentage) / 100);
    }
    
    // Handle fixed width case: "630px"
    const fixedMatch = rule.match(/(\d+)px$/);
    if (fixedMatch) {
      return Number(fixedMatch[1]);
    }
    
    // Default fallback width
    return 630;
  });
  
  // Find the maximum calculated width
  const maxCalculatedWidth = Math.max(...calculatedWidths);
  
  // Account for high-DPI displays (max 2x, capped at a reasonable maximum)
  const highDpiWidth = Math.min(maxCalculatedWidth * 2, 2000);
  
  return highDpiWidth;
};

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    // onClick,
    // onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    fetchPriority,
    // maxHeight,
    maxWidth
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  let aspectRatio = 1.5 // Default 3:2 aspect ratio

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      url,
      focalX,
      focalY,
    } = resource

    alt = altFromResource || ''
    src =
      process.env.NODE_ENV === 'development'
        ? `/api/media/file/${fullFilename}?focus=${focalX}_${focalY}`
        : `/media/${fullFilename}?focus=${focalX}_${focalY}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ')

  if(maxWidth){
    width = maxWidth
    height = Math.round(width / aspectRatio)
  }else{
    width = getMaxDimensionsFromSizes(sizes)
    height = Math.round(width / aspectRatio)
  }  

  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height : undefined}
      priority={priority}
      quality={75}
      sizes={sizes}
      src={src}
      width={!fill ? width : undefined}
      fetchPriority={fetchPriority ? fetchPriority : undefined}
    />
  )
}
