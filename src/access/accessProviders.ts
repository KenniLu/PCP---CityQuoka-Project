import type { AccessArgs, Where } from 'payload'
import type { User, UserRole } from '@/payload-types'
import { sessionContext } from '@/utilities/userUtilities'

type accessProviders = (args: AccessArgs<User>) => Promise<boolean | Where>

export const accessProviders: accessProviders = async (args) => {
  const { user } = args.req
  if (user) {
    const { isSuperAdmin, roles, providers } = (await sessionContext(user.id)) || {}
    if (isSuperAdmin) {
      return true
    } else if (providers && Object.keys(providers).length > 1) {
      return {
        id: {
          in: Object.keys(providers),
        },
      }
    }
  }
  return false
}
