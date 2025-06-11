import React from 'react'
import ProviderSwitcherClient from './Client'
import { useSessionContext, setSessionContext } from '@/utilities/userUtilities'

const ProviderSwitcher: React.FC = async () => {
  const { sessionContext, user } = (await useSessionContext()) || {}

  const setProvider = async (providerId: number|null) => {
    'use server'
    await setSessionContext(user!, providerId, true)
  }

  return (
    <>
      {sessionContext && (
        <ProviderSwitcherClient sessionContext={sessionContext} setProvider={setProvider} />
      )}
    </>
  )
}

export default ProviderSwitcher
