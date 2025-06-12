import type { CollectionBeforeChangeHook } from 'payload'
import { useSessionContext } from '@/utilities/userUtilities'
import { CustomBackendError } from '@/errors/CustomBackendError'

export const injectProvider: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const { sessionContext } = (await useSessionContext()) || {}

  if (operation === 'create') {
    data.provider = sessionContext?.currentProviderId
  } else if (operation === 'update' && originalDoc.provider !== sessionContext?.currentProviderId) {
    throw new CustomBackendError('Document does not belong to current Provider')
  }
}
