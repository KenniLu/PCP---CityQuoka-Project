'use client'

import React from 'react'
import { ReactionsProvider } from '@/providers/ReactionsProvider'

const PageClient: React.FC<{
  children: React.ReactNode
  postIds: number[]
}> = ({ children, postIds }) => {
  return <ReactionsProvider postIds={postIds}>{children}</ReactionsProvider>
}

export default PageClient
