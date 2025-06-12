import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "venues_google_place_id_idx";
  DROP INDEX IF EXISTS "venues_phone_idx";
  DROP INDEX IF EXISTS "venues_website_idx";
  DROP INDEX IF EXISTS "venues_instagram_handle_idx";
  DROP INDEX IF EXISTS "venues_tiktok_handle_idx";
  DROP INDEX IF EXISTS "venues_x_handle_idx";
  DROP INDEX IF EXISTS "venues_facebook_url_idx";
  DROP INDEX IF EXISTS "venues_linktree_url_idx";
  DROP INDEX IF EXISTS "venues_linked_in_url_idx";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE UNIQUE INDEX IF NOT EXISTS "venues_google_place_id_idx" ON "venues" USING btree ("google_place_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_phone_idx" ON "venues" USING btree ("phone");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_website_idx" ON "venues" USING btree ("website");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_instagram_handle_idx" ON "venues" USING btree ("instagram_handle");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_tiktok_handle_idx" ON "venues" USING btree ("tiktok_handle");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_x_handle_idx" ON "venues" USING btree ("x_handle");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_facebook_url_idx" ON "venues" USING btree ("facebook_url");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_linktree_url_idx" ON "venues" USING btree ("linktree_url");
  CREATE UNIQUE INDEX IF NOT EXISTS "venues_linked_in_url_idx" ON "venues" USING btree ("linked_in_url");`)
}
