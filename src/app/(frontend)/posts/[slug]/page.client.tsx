'use client'
// import { useHeaderTheme } from '@/providers/HeaderTheme'
import React from 'react'
import { ReactionsProvider } from '@/providers/ReactionsProvider'

const PageClient: React.FC<{
  children: React.ReactNode
  postIds: number[]
}> = ({ children, postIds }) => {
  /* Force the header to be dark mode while we have an image behind it */
  // const { setHeaderTheme } = useHeaderTheme()

  // useEffect(() => {
  //   setHeaderTheme('dark')
  // }, [setHeaderTheme])
  // return <React.Fragment />
  return <ReactionsProvider postIds={postIds}>{children}</ReactionsProvider>
}

export default PageClient
