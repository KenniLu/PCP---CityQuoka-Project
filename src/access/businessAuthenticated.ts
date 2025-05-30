import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isBusinessAuthenticated = (args: AccessArgs<User>) => boolean

export const businessAuthenticated: isBusinessAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}
