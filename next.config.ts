import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler: process.env.NODE_ENV === "production"
      ? require.resolve("./cache-handler.mjs")
      : undefined,
  cacheMaxMemorySize: 0, // Disable default in-memory caching
  images: {
    loaderFile: './cloudfrontLoader.ts',
    deviceSizes: [300, 600, 900], // Smaller viewport sizes
    imageSizes: [1400, 1920], // Larger image sizes
  },
  reactStrictMode: true,
  redirects,
}

const standaloneConfig: { output?: 'standalone' | undefined } =
  process.env.NODE_ENV === 'development' ? {} : { output: 'standalone' }

export default withPayload({ ...nextConfig, ...standaloneConfig })
