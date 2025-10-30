import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Bring the auth table up to date with the profile form fields.
  await db.execute(sql`
    ALTER TABLE "cms_users"
      ADD COLUMN IF NOT EXISTS "mobile_number" text,
      ADD COLUMN IF NOT EXISTS "address" text,
      ADD COLUMN IF NOT EXISTS "city" text,
      ADD COLUMN IF NOT EXISTS "state" text,
      ADD COLUMN IF NOT EXISTS "postal_code" text;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop the additional profile columns if this migration is rolled back.
  await db.execute(sql`
    ALTER TABLE "cms_users"
      DROP COLUMN IF EXISTS "mobile_number",
      DROP COLUMN IF EXISTS "address",
      DROP COLUMN IF EXISTS "city",
      DROP COLUMN IF EXISTS "state",
      DROP COLUMN IF EXISTS "postal_code";
  `)
}
