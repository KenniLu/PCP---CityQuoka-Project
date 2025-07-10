// Docs: https://aws.amazon.com/developer/application-security-performance/articles/image-optimization
export default function cloudfrontLoader({ src, width, quality }) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}${src}`)
    url.searchParams.set('format', 'auto')
    url.searchParams.set('width', width.toString())
    url.searchParams.set('quality', (quality || 90).toString())
    return url.href
  } catch (error) {
    console.error('Failed to construct URL:', error)

    // Return SVG placeholder for /media paths
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${Math.round(width * 0.75)}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Image</text>
        </svg>
      `)}`
  }
}
