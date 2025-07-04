import type { AccessArgs, Where } from 'payload'
import type { User } from '@/payload-types'
import { sessionContext } from '@/utilities/userUtilities'

type accessProviders = (args: AccessArgs<User>) => Promise<boolean | Where>

export const accessProviders: accessProviders = async (args) => {
  const { user } = args.req
  if (user) {
    const { isSuperAdmin } = (await sessionContext(user.id)) || {}
    if (isSuperAdmin) {
      return true
    }
  }
  return false
}
