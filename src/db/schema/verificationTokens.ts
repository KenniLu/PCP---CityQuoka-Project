import { pgTable, text, timestamp, uniqueIndex } from '@payloadcms/db-postgres/drizzle/pg-core'

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    // https://github.com/drizzle-team/drizzle-orm/issues/2372
    // primaryKey({
    //   columns: [verificationToken.identifier, verificationToken.token],
    // }),
    uniqueIndex('verification_tokens_identifier_and_token_uniq_indx').on(
      verificationToken.identifier,
      verificationToken.token,
    ),
  ],
)
