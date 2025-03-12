import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  integer,
  boolean,
  uuid,
} from '@payloadcms/db-postgres/drizzle/pg-core'
import { cmsUsers } from './cmsUsers'

export const authenticators = pgTable(
  'authenticators',
  {
    credentialID: text('credential_id').notNull().unique(),
    userId: uuid('cms_user_id')
      .notNull()
      .references(() => cmsUsers.id, { onDelete: 'cascade' }),
    providerAccountId: text('provider_account_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    transports: text('transports'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (authenticator) => [
    // https://github.com/drizzle-team/drizzle-orm/issues/2372
    // primaryKey({
    //   columns: [authenticator.userId, authenticator.credentialID],
    // }),
    uniqueIndex('authenticator_user_and_credential_uniq_indx').on(
      authenticator.userId,
      authenticator.credentialID,
    ),
  ],
)
