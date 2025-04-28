import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loaderFile: './cloudfrontLoader.ts',
    deviceSizes: [300, 600,  900], // Smaller viewport sizes
    imageSizes: [1400, 1920], // Larger image sizes
  },
  reactStrictMode: true,
  redirects,
}

const standaloneConfig = process.env.NODE_ENV === 'development' ? {} : { output: 'standalone' }

export default withPayload({ ...nextConfig, ...standaloneConfig })
