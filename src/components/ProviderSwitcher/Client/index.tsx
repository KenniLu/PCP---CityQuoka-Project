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
      <p style={{ whiteSpace: 'nowrap' }}>{sessionContext?.currentProviderName || 'No Session'}</p>
      {sessionContext?.isSuperAdmin && sessionContext.currentProviderId !== null && (
        <button style={{ cursor: 'pointer' }} onClick={async () => await setProvider(null)}>
          reset
        </button>
      )}
    </div>
  )
}

export default ProviderSwitcherClient
