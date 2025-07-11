/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import { getSessionContext, SessionContextType } from '@/utilities/userUtilities'
import PendingVerification from '@/components/PendingVerification'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const showPendingVerification = (
    sessionContext: SessionContextType,
    segments: string[],
  ): boolean => {
    if (segments && segments.length === 1 && segments[0] === 'logout') {
      return false
    }
    if (sessionContext) {
      if (!sessionContext.isSuperAdmin) {
        if (
          !sessionContext.currentProvider ||
          sessionContext.currentProvider.verificationStatus !== 'verified'
        ) {
          return true
        }
      }
    }
    return false
  }
  const { sessionContext } = (await getSessionContext()) || {}
  const { segments } = await params
  if (showPendingVerification(sessionContext!, segments)) {
    return <PendingVerification />
  }
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
