import type { CollectionAfterLoginHook } from 'payload'
import { getNameSpacedTable } from '@/utilities/getNameSpacedTable'
import { cookies as nextCookies } from 'next/headers.js'
import { generatePayloadCookie } from 'payload'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { PersistedContextType } from '@/utilities/userUtilities'
import { SUPERADMIN } from '@/utilities/userUtilities'

// This hook establishes the Providers that are applicable to the user and also sets current Provider
export const afterUserLogin: CollectionAfterLoginHook = async ({
  collection,
  req: { payload },
  user,
}) => {
  const userRoles: number[] = user.userRoles
  const providersTable = getNameSpacedTable(payload, 'providers')
  const userRolesTable = getNameSpacedTable(payload, 'user_roles')
  const userProviders = await payload.db.execute({
    drizzle: payload.db.drizzle,
    raw: `select p.id, p.name from ${providersTable} p
      inner join ${userRolesTable} r on r.provider_id = p.id
      where r.id in (${userRoles.join(',')})`,
  })
  const providers = userProviders.rows.reduce((h, row) => {
    h[row.name] = row.id
    return h
  }, {})
  let currentId: number|null = null
  let currentName: string = ''
  if (userProviders.rows.length > 0) {
    const currentProvider = userProviders.rows[0]
    currentId = currentProvider.id
    currentName = currentProvider.name
  }else{
    currentName = SUPERADMIN
  }
  const sessionContext: PersistedContextType = { u: user.id, p: providers, i: currentId!, n: currentName!, r: userRoles }

  const sessionContextCookie = generatePayloadCookie({
    cookiePrefix: 'cq-session-context',
    collectionAuthConfig: collection.auth,
    returnCookieAsObject: true,
    token: payload.encrypt(JSON.stringify(sessionContext)),
  })

  const cookies = await nextCookies()
  cookies.set({
    ...(sessionContextCookie as ResponseCookie),
    expires: new Date(sessionContextCookie.expires!),
  })
  return null
}
