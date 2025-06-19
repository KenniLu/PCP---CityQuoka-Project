import { Where } from 'payload'
import { SessionContextType, getSessionContext, providerRoles } from './userUtilities'
import { PERMISSION_KEYS, RolePermissionType } from '@/types/permissions'
import { UserRole } from '@/payload-types'

export const providerListFilter = async ({ limit, page, req, sort }): Promise<Where | null> => {
  const { sessionContext } = (await getSessionContext()) || {}
  if (sessionContext) {
    return {
      provider: {
        equals: sessionContext.currentProviderId,
      },
    }
  } else {
    return null
  }
}

export const roleListFilter = async ({ limit, page, req, sort }): Promise<Where | null> => {
  const { sessionContext } = (await getSessionContext()) || {}
  if (sessionContext) {
    const roles = await providerRoles(sessionContext.currentProviderId)
    return {
      userRoles: {
        in: roles.map((role) => role.id),
      },
    }
  } else {
    return null
  }
}

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
