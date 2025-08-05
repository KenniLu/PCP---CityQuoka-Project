// 'use client';

import React from 'react'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Logo } from '@/components/Logo/Logo'

import '../../globals.css'
import localFont from 'next/font/local'

export const dynamic = 'force-dynamic'

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

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
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
        <title>City Quokka - Provider Management</title>
        <meta name="description" content="Manage your provider profile and users" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen w-full bg-white">
          <main className="flex-grow flex justify-center w-full">
            <div className="flex flex-col items-center w-full bg-white">
              <div className="flex flex-col w-full bg-white pt-6 mb-4">
                <div className="flex flex-col self-center w-full max-w-4xl mx-auto lg:max-w-6xl xl:max-w-7xl px-3">
                  <Logo />
                  <div className="w-full h-[4px] bg-[#EFEFEF]"></div>
                </div>
              </div>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
