'use client'
import React from 'react'
import { SessionContextType } from '@/utilities/userUtilities'

export type ProviderSwitcherProps = {
  sessionContext: SessionContextType
}

const ProviderSwitcherClient: React.FC<ProviderSwitcherProps> = ({sessionContext}) => {
  return (
    <div>{sessionContext?.currentProviderName || 'No Session'}</div>
  )
}

export default ProviderSwitcherClient
