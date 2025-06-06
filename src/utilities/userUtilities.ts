import { UserRole, Provider } from '@/payload-types'
import { User } from 'payload'
import { AccessResult, AccessArgs, Where } from 'payload'
import { cookies as nextCookies, headers as getHeaders } from 'next/headers'
import { getNameSpacedTable } from '@/utilities/getNameSpacedTable'
import { generatePayloadCookie } from 'payload'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { refresh } from '@payloadcms/next/auth'


import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const SUPERADMIN: string = 'SuperAdmin'
export const NOPROVIDER: string = 'None'

import { RolePermissionType, PERMISSION_KEYS } from '@/types/permissions'

// Short form for smaller token size
export type PersistedContextType = {
  u: User['id']
  p: { [key: string]: string }
  i: number | null
  n: string
}

export type SessionContextType = {
  userId: User['id']
  providers: { [key: string]: string }
  currentProviderId: number | null
  currentProviderName: string
  roles: Partial<UserRole>[]
  isSuperAdmin: boolean
}

const payloadInstance = cache(async () => {
  return await getPayload({ config })
})

export const userRoles = cache(async (userId: User['id']): Promise<Partial<UserRole>[]> => {
  const payload = await payloadInstance()
  const usersRelsTable = getNameSpacedTable(payload, 'users_rels')
  const userRolesTable = getNameSpacedTable(payload, 'user_roles')

  const roles = await payload.db.execute({
    drizzle: payload.db.drizzle,
    raw: `select r.id as id, r.permissions as permissions, r.provider_id as provider from ${userRolesTable} r
      inner join ${usersRelsTable} u on u.user_roles_id = r.id where u.parent_id = ${userId}`,
  })
  return roles.rows
})

export const providerRoles = cache(async (providerId: Provider['id']): Promise<Partial<UserRole>[]> => {
  const payload = await payloadInstance()
  const userRolesTable = getNameSpacedTable(payload, 'user_roles')
  const roles = await payload.db.execute({
    drizzle: payload.db.drizzle,
    raw: `select r.id as id, r.permissions as permissions, r.provider_id as provider from ${userRolesTable} r
      where r.provider_id = ${providerId}`,
  })
  return roles.rows
})

export const setSessionContext = async (user: User, providerId: number | null = null, refreshSession: boolean = false) => {
  const payload = await payloadInstance()
  if (user) {
    let roles: number[] | Partial<UserRole>[] = user.userRoles
    if (typeof roles[0] === 'number') {
      roles = await userRoles(user.id)
    }
    const isSuperAdmin = (roles as Partial<UserRole>[]).some(
      (role: UserRole) => !role.provider && (role.permissions as RolePermissionType)?.admin,
    )
    let providers: { [key: string]: string } = {}

    if (!isSuperAdmin) {
      const providersTable = getNameSpacedTable(payload, 'providers')
      const userRolesTable = getNameSpacedTable(payload, 'user_roles')
      const userProviders = await payload.db.execute({
        drizzle: payload.db.drizzle,
        raw: `select p.id, p.name from ${providersTable} p
        inner join ${userRolesTable} r on r.provider_id = p.id
        where r.id in (${roles.map((role) => role.id).join(',')})`,
      })
      providers = userProviders.rows.reduce((h, row) => {
        h[row.id.toString()] = row.name
        return h
      }, {})
    }

    let currentId: number | null = providerId
    let currentName: string = ''
    if (isSuperAdmin) {
      if (currentId) {
        const providersTable = getNameSpacedTable(payload, 'providers')
        const providerNames = await payload.db.execute({
          drizzle: payload.db.drizzle,
          raw: `select p.name from ${providersTable} p where id=${currentId} limit 1`,
        })
        currentName = providerNames.rows[0].name
      } else {
        currentName = SUPERADMIN
      }
    } else {
      if (currentId && currentId.toString() in providers) {
        currentName = providers[currentId.toString()]
      } else {
        const defaultID = Object.keys(providers)[0]
        currentId = Number(defaultID)
        currentName = providers[defaultID]
      }
    }

    const sessionContext: PersistedContextType = {
      u: user.id,
      p: providers,
      i: currentId!,
      n: currentName!,
    }

    const sessionContextCookie = generatePayloadCookie({
      cookiePrefix: 'cq-session-context',
      collectionAuthConfig: payload.collections.users.config.auth,
      returnCookieAsObject: true,
      token: payload.encrypt(JSON.stringify(sessionContext)),
    })

    const cookies = await nextCookies()
    cookies.set({
      ...(sessionContextCookie as ResponseCookie),
      expires: new Date(sessionContextCookie.expires!),
    })
    if(refreshSession){
      await refresh({
        collection: 'users',
        config
      })
    }
  }
}

export const currentUser = cache(async (): Promise<User | null> => {
  const payload = await payloadInstance()
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  return user
})

export const sessionContext = cache(
  async (userId: User['id']): Promise<SessionContextType | null> => {
    let context: PersistedContextType | null = null
    const cookies = await nextCookies()
    const contextValue = cookies.get('cq-session-context-token')?.value
    if (contextValue) {
      const decryptedContext = (await payloadInstance()).decrypt(contextValue)
      context = JSON.parse(decryptedContext) as PersistedContextType
    }
    if (context?.u === userId) {
      let roles = await userRoles(userId)
      const isSuperAdmin = roles.some(
        (role: UserRole) => !role.provider && (role.permissions as RolePermissionType)?.admin,
      )
      // If we are in the context of a provider, Assume the admin role of the provider
      if(isSuperAdmin && context.i){
        const _providerRoles = await providerRoles(context.i)
        const _providerAdminRole = _providerRoles.find((role) => role.permissions?.['admin'])
        roles = _providerAdminRole ? [_providerAdminRole] : []
      }
      return {
        userId: context.u,
        providers: context.p,
        currentProviderId: context.i,
        currentProviderName: context.n,
        roles,
        isSuperAdmin,
      }
    } else {
      return null
    }
  },
)

export const useSessionContext = cache(async (): Promise<SessionContextType | null> => {
  const user = await currentUser()
  if (user) {
    return await sessionContext(user.id)
  } else {
    return null
  }
})

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
      if(role.provider !== session.currentProviderId){
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
