import {
  pgTable,
  text,
  timestamp,
  uuid
} from '@payloadcms/db-postgres/drizzle/pg-core'

import { cmsUsers } from "./cmsUsers";

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("cms_user_id")
    .notNull()
    .references(() => cmsUsers.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})