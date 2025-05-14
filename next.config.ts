import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler:
    process.env.NODE_ENV === 'production' ? require.resolve('./cache-handler.mjs') : undefined,
  cacheMaxMemorySize: 0, // Disable default in-memory caching
  images: {
    loaderFile: './cloudfrontLoader.ts',
    deviceSizes: [640, 768, 1024, 1122], 
    imageSizes: [ 256, 384],
  },
  reactStrictMode: true,
  redirects,
  async headers() {
    // Set cache headers for icons
    return [
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

const standaloneConfig: { output?: 'standalone' | undefined } =
  process.env.NODE_ENV === 'development' ? {} : { output: 'standalone' }

export default withPayload({ ...nextConfig, ...standaloneConfig })
