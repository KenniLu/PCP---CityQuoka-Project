import type { AccessArgs, Access } from 'payload'

import type { User, UserRole } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

export const superAuthenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user) && user?.userRoles?.some((role: UserRole) => !role.provider && role.name == 'SuperAdmin') === true
}
