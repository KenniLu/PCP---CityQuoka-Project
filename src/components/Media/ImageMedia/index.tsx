import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'

import type { Props as MediaProps } from '../types'

import cssVariables from '@/cssVariables'

const { breakpoints } = cssVariables

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
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
      focalX,
      focalY
    } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''
    src = ( process.env.NODE_ENV === 'development' ?  `${url}?focus=${focalX}_${focalY}` : `/media/${fullFilename}?focus=${focalX}_${focalY}` )
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ')
  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height : undefined}
      priority={priority}
      quality={90}
      sizes={sizes}
      src={src}
      width={!fill ? width : undefined}
    />
  )
}
