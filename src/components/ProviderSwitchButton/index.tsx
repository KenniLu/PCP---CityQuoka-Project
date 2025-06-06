import ProviderSwitchButtonClient from './Client'
import { useSessionContext, setSessionContext, currentUser } from '@/utilities/userUtilities'

const ProviderSwitchButton: React.FC = async () => {
  const sessionContext = await useSessionContext()

  const setProvider = async (providerId: number) => {
    'use server'
    const user = await currentUser()
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
