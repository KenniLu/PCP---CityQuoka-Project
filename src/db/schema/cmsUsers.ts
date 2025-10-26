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
    mobileNumber: text('mobile_number'),
<<<<<<< HEAD
    address: text('address'),
    city: text('city'),
    state: text('state'),
    postalCode: text('postal_code'),
    password: text('password'),
    mobileNumber: numeric('mobile_number'),
=======
>>>>>>> 066a3544f1e34c9e620d9cfd205dbff7ae699b27
    address: text('address'),
    city: text('city'),
    state: text('state'),
    postalCode: text('postal_code'),
    password: text('password'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('cms_users_email_indx').on(table.email)],
)
