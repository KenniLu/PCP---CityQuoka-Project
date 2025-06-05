import { UserRole } from '@/payload-types'
import { User } from 'payload'
import { AccessResult, AccessArgs, Where } from 'payload'
import { cookies as nextCookies } from 'next/headers'

import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const SUPERADMIN: string = 'SuperAdmin'
import { RolePermissionType, PERMISSION_KEYS } from '@/types/permissions'

// Short form for smaller token size
export type PersistedContextType = {
  u: User['id']
  p: { [key: string]: number }
  i: number | null
  n: string
  r: number[]
}

export type SessionContextType = {
  userId: User['id']
  providers: { [key: string]: number }
  currentProviderId: number | null
  currentProviderName: string
  roleIds: number[]
  roles: UserRole[]
  isSuperAdmin: boolean
}

const payloadInstance = cache(async () => {
  return await getPayload({ config })
})

export const userRoles = async (roleIds: number[], currentProviderId: number | null) => {
  if (roleIds.length > 0) {
    const payload = await payloadInstance()
    const roles = await payload.find({
      collection: 'user-roles',
      limit: 100,
      depth: 0,
      where: {
        and: [
          {
            id: {
              in: roleIds,
            },
          },
          {
            provider: {
              equals: currentProviderId,
            },
          },
        ],
      },
    })
    return roles.docs
  } else {
    return []
  }
}

export const sessionContext = cache(async (user: User): Promise<SessionContextType | {}> => {
  let context: PersistedContextType | null = null
  const cookies = await nextCookies()
  const contextValue = cookies.get('cq-session-context-token')?.value
  if (contextValue) {
    const decryptedContext = (await payloadInstance()).decrypt(contextValue)
    context = JSON.parse(decryptedContext) as PersistedContextType
  }
  if (context?.u === user?.id) {
    const roles = await userRoles(context.r, context.i)
    const isSuperAdmin = roles.some(
      (role: UserRole) => !role.provider && (role.permissions as RolePermissionType)?.admin,
    )
    return {
      userId: context.u,
      providers: context.p,
      currentProviderId: context.i,
      currentProviderName: context.n,
      roleIds: context.r,
      roles,
      isSuperAdmin,
    }
  } else {
    return {}
  }
})

export const currentProvider = cache(async (user: User) => {
  const session = (await sessionContext(user)) as SessionContextType
  return session.currentProviderId
})

export const checkUserPermission = async (
  roles: UserRole[],
  slug: (typeof PERMISSION_KEYS)[number],
  action: string,
): Promise<boolean> => {
  if (roles.length > 0) {
    return roles.some((role: UserRole) => {
      const permissions = role.permissions as RolePermissionType
      return (
        permissions.admin || (permissions[slug] || {})['admin'] || (permissions[slug] || {})[action]
      )
    })
  } else {
    return false
  }
}

// This methods returns
// 1. true if authenticated as admin but current path not matching checkpath
// 2. A whereclause scoped to current provider if within
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
    const session = (await sessionContext(user)) as SessionContextType
    const canRead = await checkUserPermission(session.roles, slug, 'read')
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
