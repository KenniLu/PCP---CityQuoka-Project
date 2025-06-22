import type { CollectionAfterLoginHook } from 'payload'
import { setSessionContext } from '@/utilities/userUtilities'

// This hook establishes the Providers that are applicable to the user and also sets current Provider
export const afterUserLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  // We are setting the loginAttempts to 0 here because payload's
  // packages/payload/src/auth/strategies/local/resetLoginAttempts.ts
  // is checking for typeof user.lockUntil === 'string' which is not resetting loginAttempts!
  if (user.loginAttempts !== 0) {
    await req.payload.update({
      id: user.id,
      collection: 'users',
      data: {
        lockUntil: null,
        loginAttempts: 0,
      },
      depth: 0,
      overrideAccess: true,
      req,
    })
  }

  await setSessionContext(user)
}
