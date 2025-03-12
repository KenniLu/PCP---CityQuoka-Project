import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  uniqueIndex,
} from '@payloadcms/db-postgres/drizzle/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import { cmsUsers } from './cmsUsers'

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('cms_user_id')
      .notNull()
      .references(() => cmsUsers.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (accounts) => [
    // https://github.com/drizzle-team/drizzle-orm/issues/2372
    // primaryKey({
    //   columns: [accounts.provider, accounts.providerAccountId],
    // }),
    uniqueIndex('accounts_provider_and_provider_account_id_uniq_indx').on(
      accounts.provider,
      accounts.providerAccountId,
    ),
  ],
)
