import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import React from 'react'

import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import '../../globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const acuminFont = localFont({
  src: [
    {
      path: '../../../public/fonts/AcuminProExtraCond-UltraBlack.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  preload: true,
  display: 'block',
  variable: '--font-acumin', // Optional: for CSS variable usage
})

const authorFont = localFont({
  src: [
    {
      path: '../../../public/fonts/Author-Extralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Author-ExtralightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/Author-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Author-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/Author-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Author-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/Author-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Author-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/Author-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Author-SemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/Author-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Author-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  preload: true,
  display: 'block',
  variable: '--font-author',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        acuminFont.variable,
        authorFont.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {draft && <LivePreviewListener />}
          <div className="flex flex-col min-h-screen w-full bg-white">
            <main className="flex-grow flex justify-center w-full">
              <div className="flex flex-col items-center w-full bg-white">
                <Header />
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
}
