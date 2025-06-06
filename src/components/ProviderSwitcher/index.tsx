import React from 'react'
import ProviderSwitcherClient from './Client'
import { useSessionContext } from '@/utilities/userUtilities'

const ProviderSwitcher: React.FC = async () => {
  const sessionContext = await useSessionContext()
  return <>{sessionContext && <ProviderSwitcherClient sessionContext={sessionContext} />}</>
}

export default ProviderSwitcher
