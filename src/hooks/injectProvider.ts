import type { CollectionBeforeChangeHook } from 'payload'
import { getSessionContext } from '@/utilities/userUtilities'
import { CustomBackendError } from '@/errors/CustomBackendError'

export const injectProvider: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const { sessionContext } = (await getSessionContext()) || {}

  if (operation === 'create') {
    data.provider = sessionContext?.currentProvider?.id
  } else if (operation === 'update' && originalDoc.provider?.id !== sessionContext?.currentProvider?.id) {
    throw new CustomBackendError('Document does not belong to current Provider')
  }
}
