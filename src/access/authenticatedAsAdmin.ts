import type { AccessArgs, Where } from 'payload'

import type { User, UserRole } from '@/payload-types'

type authenticatedAsAdmin = (args: AccessArgs<User>, checkArgs?: {where: Where}) => boolean|Where

export const authenticatedAsAdmin: authenticatedAsAdmin = ({ req: { user } }, checkArgs) => {
  if (Boolean(user)) {
    return (user?.userRoles || []).some(
      (userRole: UserRole) => (userRole.permissions || {})['admin'] === true,
    )
  }
  return false
}
