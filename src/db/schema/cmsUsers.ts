import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  numeric,
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
    mobileNumber: numeric('mobile_number'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    postalCode: numeric('postal_code'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('cms_users_email_indx').on(table.email)],
)
