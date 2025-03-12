import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cmsUsers, sessions, accounts, verificationTokens, authenticators } from '@/db/schema'
import { eq, and } from '@payloadcms/db-postgres/drizzle'

export function AuthAdapter() {

  const dbClient = async () => {
    const payload = await getPayload({ config: configPromise })
    return await payload.db.drizzle
  }
  return {
    async createUser(data) {
      const { id, ...insertData } = data
      // const hasDefaultId = getTableColumns(usersTable)["id"]["hasDefault"]
      const client = await dbClient()
      return client.insert(cmsUsers as any).values(insertData).returning().then((res)=>res[0])
    },
    async getUser(userId: string) {
      const client = await dbClient()
      return client
        .select()
        .from(cmsUsers)
        .where(eq(cmsUsers.id, userId))
        .then((res) =>
          res.length > 0 ? res[0] : null
        )
    },
    async getUserByEmail(email: string) {
      const client = await dbClient()
      return client
        .select()
        .from(cmsUsers)
        .where(eq(cmsUsers.email, email))
        .then((res) =>
          res.length > 0 ? res[0] : null
        )
    },
    async createSession(data: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      const client = await dbClient()
      return client
        .insert(sessions as any)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async getSessionAndUser(sessionToken: string) {
      const client = await dbClient()
      return client
        .select({
          session: sessions,
          user: cmsUsers,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .innerJoin(cmsUsers, eq(cmsUsers.id, sessions.userId))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error("No user id.")
      }
      const client = await dbClient()
      const [result] = await client
        .update(cmsUsers)
        .set(data)
        .where(eq(cmsUsers.id, data.id))
        .returning()

      if (!result) {
        throw new Error("No user found.")
      }

      return result
    },
    async updateSession(
      data
    ) {
      const client = await dbClient()
      return client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0])
    },
    async linkAccount(data) {
      const client = await dbClient()
      await client.insert(accounts).values(data)
    },
    async getUserByAccount(
      account
    ) {
      const client = await dbClient()
      const result = await client
        .select({
          account: accounts,
          user: cmsUsers,
        })
        .from(accounts)
        .innerJoin(cmsUsers, eq(accounts.userId, cmsUsers.id))
        .where(
          and(
            eq(accounts.provider, account.provider),
            eq(accounts.providerAccountId, account.providerAccountId)
          )
        )
        .then((res) => res[0])

      const user = result?.user ?? null
      return user
    },
    async deleteSession(sessionToken: string) {
      const client = await dbClient()
      await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
    },
    async createVerificationToken(data) {
      const client = await dbClient()
      return client
        .insert(verificationTokens)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      const client = await dbClient()
      return client
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, params.identifier),
            eq(verificationTokens.token, params.token)
          )
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async deleteUser(id: string) {
      const client = await dbClient()
      await client.delete(cmsUsers).where(eq(cmsUsers.id, id))
    },
    async unlinkAccount(
      params
    ) {
      const client = await dbClient()
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, params.provider),
            eq(accounts.providerAccountId, params.providerAccountId)
          )
        )
    },
    async getAccount(providerAccountId: string, provider: string) {
      const client = await dbClient()
      return client
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        )
        .then((res) => res[0] ?? null)
    },
    async createAuthenticator(data) {
      const client = await dbClient()
      return client
        .insert(authenticators)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null)
    },
    async getAuthenticator(credentialID: string) {
      const client = await dbClient()
      return client
        .select()
        .from(authenticators)
        .where(eq(authenticators.credentialID, credentialID))
        .then((res) => res[0] ?? null)
    },
    async listAuthenticatorsByUserId(userId: string) {
      const client = await dbClient()
      return client
        .select()
        .from(authenticators)
        .where(eq(authenticators.userId, userId))
        .then((res) => res)
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const client = await dbClient()
      const authenticator = await client
        .update(authenticators)
        .set({ counter: newCounter })
        .where(eq(authenticators.credentialID, credentialID))
        .returning()
        .then((res) => res[0])

      if (!authenticator) throw new Error("Authenticator not found.")

      return authenticator
    },
  }

}