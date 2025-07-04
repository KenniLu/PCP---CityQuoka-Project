'use client'
import { useSelection } from '@payloadcms/ui'

export type ProviderSwitchButtonClientProps = {
  currentProviderId: number | null | undefined
  setProvider: (providerId: number|null) => Promise<void>
}

const ProviderSwitchButtonClient: React.FC<ProviderSwitchButtonClientProps> = ({
  currentProviderId,
  setProvider,
}) => {
  const { count, getSelectedIds } = useSelection()
  const selectedProviderId = getSelectedIds()[0]
  if (count == 1 && currentProviderId !== selectedProviderId) {
    return (
      <button onClick={async () => await setProvider(selectedProviderId as number)}>
        Switch into Provider
      </button>
    )
  } else {
    return <></>
  }
}

export default ProviderSwitchButtonClient
