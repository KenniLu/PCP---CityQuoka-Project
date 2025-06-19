import type { AccessArgs, Where } from 'payload'
import type { User, UserRole } from '@/payload-types'
import { sessionContext } from '@/utilities/userUtilities'

type accessUsers = (args: AccessArgs<User>) => Promise<boolean | Where>

export const accessUsers: accessUsers = async (args) => {
  const { user, pathname } = args.req
  if (user) {
    const { isSuperAdmin, roles } = (await sessionContext(user.id)) || {}
    if (isSuperAdmin) {
      return true
    } else if ((roles || []).some((role: UserRole) => (role.permissions || {})['admin'])) {
      return true
    } else {
      if (!pathname.match(new RegExp('/account$'))) {
        return false
      } else {
        return {
          id: {
            equals: user.id,
          },
        }
      }
    }
  }
  return false
}
