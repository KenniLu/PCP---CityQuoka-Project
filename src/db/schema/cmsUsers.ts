import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from '@payloadcms/db-postgres/drizzle/pg-core'

export const cmsUsers = pgTable(
  'cms_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    password: text('password'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('cms_users_email_indx').on(table.email)],
)
