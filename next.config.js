import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  webpack: (config) => {
    config.resolve.alias['@'] = join(__dirname, 'src')
    return config
  }
}

export default withPayload(nextConfig)
