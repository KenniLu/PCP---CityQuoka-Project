import type { AccessArgs, Where } from 'payload'
import type { User } from '@/payload-types'
import { sessionContext, SUPERADMIN } from '@/utilities/userUtilities'

type isSuperAdmin = (args: AccessArgs<User>) => Promise<boolean | Where>

export const isSuperAdmin: isSuperAdmin = async (args) => {
  const { user } = args.req
  if (user) {
    const { isSuperAdmin, currentProvider } = (await sessionContext(user.id)) || {}
    return Boolean(isSuperAdmin && !currentProvider) 
  }
  return false
}
