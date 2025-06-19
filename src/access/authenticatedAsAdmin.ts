import type { AccessArgs, Where } from 'payload'
import type { User, UserRole } from '@/payload-types'
import { sessionContext } from '@/utilities/userUtilities'

type authenticatedAsAdmin = (args: AccessArgs<User>) => Promise<boolean | Where>

export const authenticatedAsAdmin: authenticatedAsAdmin = async (args) => {
  const { user } = args.req
  if (user) {
    const { isSuperAdmin, roles } = (await sessionContext(user.id)) || {}
    if (isSuperAdmin) {
      return true
    } else if ((roles || []).some((role: UserRole) => (role.permissions || {})['admin'])) {
      return true
    }
  }
  return false
}
