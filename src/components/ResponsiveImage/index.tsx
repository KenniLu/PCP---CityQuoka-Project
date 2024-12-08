import { getSignedUrl } from '@/utilities/s3Utilities'
import type { Media } from '@/payload-types'
import path from 'path'
import { cn } from '@/utilities/cn'

interface ResponsiveImageProps {
  media: Media
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  expiresIn?: number
}

// Mark as async server component
async function ResponsiveImage({
  media,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  expiresIn = 3600
}: ResponsiveImageProps) {

  const {prefix, sizes: mediaSizes} = media
  const signedUrlsPromises = Object.entries(mediaSizes!).map(async ([_, imageData]) => {
    const key = path.posix.join(prefix as string, imageData.filename as string)
    const signedUrl = await getSignedUrl(key, expiresIn)
    return {
      filename: imageData.filename,
      url: signedUrl,
      width: imageData.width as number,
      height: imageData.height as number,
    }
  })

  const signedUrls = await Promise.all(signedUrlsPromises)

  // Sort sizes by width
  const sortedUrls = signedUrls.sort((a, b) => a.width - b.width)

  // Generate srcset string
  const srcset = sortedUrls.map(({ url, width }) => `${url} ${width}w`).join(', ')

  // Use largest size as default
  const defaultImage = sortedUrls[sortedUrls.length - 1]

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={defaultImage.url}
      srcSet={srcset}
      sizes={sizes}
      alt={alt}
      className={cn(
        'w-full h-auto object-cover',
        className
      )}
      loading={priority ? 'eager' : 'lazy'}
      width={defaultImage.width}
      height={defaultImage.height}
    />
  )
}

export default ResponsiveImage
