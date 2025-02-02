import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "venues" ADD COLUMN "google_place_id" varchar;
  ALTER TABLE "venues" ADD COLUMN "formatted_address" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_google_place_id_idx" ON "venues" USING btree ("google_place_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "venues_google_place_id_idx";
  ALTER TABLE "venues" DROP COLUMN IF EXISTS "google_place_id";
  ALTER TABLE "venues" DROP COLUMN IF EXISTS "formatted_address";`)
}
