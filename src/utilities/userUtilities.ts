import { UserRole } from '@/payload-types'
import { User } from 'payload'
import { Provider } from '@/payload-types'
import { AccessResult, AccessArgs, Where } from 'payload'
import { cookies as nextCookies } from 'next/headers.js'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payloadInstance = cache(async () => {
  return await getPayload({ config: configPromise })
})

export const sessionContext = cache(async () => {
  let context = '{}'
  const cookies = await nextCookies()
  const cookieContext = cookies.get('cq-session-context-token')?.value
  if (cookieContext) {
    context = (await payloadInstance()).decrypt(cookieContext)
  }
  return JSON.parse(context)
})

export const userRoles = cache(async () => {
  const session = await sessionContext()
  const sessionRoles = session['r'] || []
  if (sessionRoles.length > 0) {
    const payload = await payloadInstance()
    const roles = await payload.find({
      collection: 'user-roles',
      limit: 1000,
      depth: 0,
      where: {
        id: {
          in: sessionRoles,
        },
      },
    })
    return roles.docs
  } else {
    return []
  }
})

export const isUserSuperAdmin = cache(async (): Promise<boolean> => {
  const roles = await userRoles()
  if (roles.length === 0) {
    return false
  } else {
    return roles.some((role: UserRole) => !role.provider && role.name == 'SuperAdmin')
  }
})

export const userProviderIds = (user: User) =>
  (user?.userRoles || []).map((userRole) => ((userRole as UserRole)?.provider as Provider)?.id)

export const adminReadAccessCheck = async (
  args: AccessArgs,
  checkArgs: {
    where: (user: User) => Where
    slug?: string
    checkpath?: string
  },
): Promise<AccessResult> => {
  const { user, pathname } = args.req
  const { where, slug, checkpath } = checkArgs

  if (!slug && !checkpath) {
    throw new Error('Either checkpath of slug is needed for adminReadAccessCheck')
  }
  // If we are not within the path for this particular collection, just return true if user is present.
  // This is to prevent too many filter queries when user is at the dashboard.
  // Apply the filter only within the context of the collection list page.

  const pathToCheck = checkpath ? checkpath : `/${slug}(?:/|$)`
  if (!pathname.match(new RegExp(pathToCheck!))) {
    return Boolean(user)
  } else if (Boolean(user)) {
    if (await isUserSuperAdmin()) {
      return true
    } else {
      return where(user!)
    }
  } else {
    return false
  }
}
