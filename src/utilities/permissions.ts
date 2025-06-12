import { AccessResult, AccessArgs, Where } from 'payload'
import { sessionContext, SessionContextType } from './userUtilities'
import { PERMISSION_KEYS, RolePermissionType } from '@/types/permissions'
import { UserRole } from '@/payload-types'

export const checkUserPermission = async (
  session: SessionContextType,
  slug: (typeof PERMISSION_KEYS)[number],
  action: string,
): Promise<boolean> => {
  if (session.isSuperAdmin) {
    return true
  }
  const roles = session.roles
  if (roles.length > 0) {
    return roles.some((role: UserRole) => {
      if (role.provider !== session.currentProviderId) {
        return false
      }
      const permissions = role.permissions as RolePermissionType
      return (
        permissions.admin || (permissions[slug] || {})['admin'] || (permissions[slug] || {})[action]
      )
    })
  } else {
    return false
  }
}

export const adminReadWithScope = async (
  args: AccessArgs,
  checkArgs: {
    where: (sessionContext: SessionContextType) => Where | boolean
    slug: (typeof PERMISSION_KEYS)[number]
    checkpath?: string
  },
): Promise<AccessResult> => {
  const { user, pathname } = args.req
  const { where, slug, checkpath } = checkArgs
  if (user) {
    const session = (await sessionContext(user.id)) as SessionContextType
    const canRead = await checkUserPermission(session, slug, 'read')
    if (canRead) {
      const pathToCheck = checkpath ? checkpath : `/${slug}(?:/|$)`
      if (!pathname.match(new RegExp(pathToCheck!))) {
        return true
      } else {
        return where(session)
      }
    } else {
      return false
    }
  } else {
    return false
  }
}
