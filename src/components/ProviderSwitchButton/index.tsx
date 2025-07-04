import ProviderSwitchButtonClient from './Client'
import { getSessionContext, setSessionContext } from '@/utilities/userUtilities'
import { Provider } from '@/payload-types'

const ProviderSwitchButton: React.FC = async () => {
  const { sessionContext, user } = (await getSessionContext()) || {}

  const setProvider = async (providerId: number | null) => {
    'use server'
    await setSessionContext(user!, providerId, true)
  }

  if (sessionContext && sessionContext.isSuperAdmin) {
    return (
      <ProviderSwitchButtonClient
        currentProviderId={sessionContext.currentProvider?.id}
        setProvider={setProvider}
      />
    )
  } else {
    return <></>
  }
}

export default ProviderSwitchButton
