'use client'
import React from 'react'
import { SessionContextType } from '@/utilities/userUtilities'

export type ProviderSwitcherProps = {
  sessionContext: SessionContextType
  setProvider: (providerId: number | null) => Promise<void>
}

const ProviderSwitcherClient: React.FC<ProviderSwitcherProps> = ({
  sessionContext,
  setProvider,
}) => {
  const providerName = (sessionContext: SessionContextType) => {
    if (sessionContext?.currentProvider) {
      return sessionContext?.currentProvider.name
    } else {
      return sessionContext.isSuperAdmin ? 'Super Admin' : 'No Session'
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'nowrap',
      }}
    >
      <p style={{ whiteSpace: 'nowrap' }}>{providerName(sessionContext)}</p>
      {sessionContext?.isSuperAdmin && sessionContext.currentProvider?.id !== null && (
        <button style={{ cursor: 'pointer' }} onClick={async () => await setProvider(null)}>
          reset
        </button>
      )}
    </div>
  )
}

export default ProviderSwitcherClient
