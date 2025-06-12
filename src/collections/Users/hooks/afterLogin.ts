import type { CollectionAfterLoginHook } from 'payload'
import { setSessionContext } from '@/utilities/userUtilities'

// This hook establishes the Providers that are applicable to the user and also sets current Provider
export const afterUserLogin: CollectionAfterLoginHook = async ({
  user
}) => {
  await setSessionContext(user)
}
