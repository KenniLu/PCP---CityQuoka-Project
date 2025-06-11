import ProviderSwitchButtonClient from './Client'
import { useSessionContext, setSessionContext } from '@/utilities/userUtilities'

const ProviderSwitchButton: React.FC = async () => {
  const { sessionContext, user } = await useSessionContext() || {}

  const setProvider = async (providerId: number|null) => {
    'use server'
    await setSessionContext(user!, providerId, true)
  }

  if (sessionContext && sessionContext.isSuperAdmin) {
    return (
      <ProviderSwitchButtonClient
        currentProviderId={sessionContext.currentProviderId}
        setProvider={setProvider}
      />
    )
  } else {
    return <></>
  }
}

export default ProviderSwitchButton
