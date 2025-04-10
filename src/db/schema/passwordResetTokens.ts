import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from '@payloadcms/db-postgres/drizzle/pg-core'

import {
  sql
} from '@payloadcms/db-postgres/drizzle'

import { cmsUsers } from './cmsUsers'

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('cms_user_id')
      .notNull()
      .references(() => cmsUsers.id, { onDelete: 'cascade' }),
    token: uuid('token').notNull().defaultRandom(),
    tokenExpiry: timestamp('token_expiry').notNull().default(sql`now() + interval '1 hour'`),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('password_tokens_token_indx').on(table.token)],
)
