import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "venues" ADD COLUMN "phone" varchar;
  ALTER TABLE "venues" ADD COLUMN "website" varchar;
  ALTER TABLE "venues" ADD COLUMN "instagram_handle" varchar;
  ALTER TABLE "venues" ADD COLUMN "tiktok_handle" varchar;
  ALTER TABLE "venues" ADD COLUMN "x_handle" varchar;
  ALTER TABLE "venues" ADD COLUMN "facebook_url" varchar;
  ALTER TABLE "venues" ADD COLUMN "linktree_url" varchar;
  ALTER TABLE "venues" ADD COLUMN "linked_in_url" varchar;
  CREATE UNIQUE INDEX "venues_phone_idx" ON "venues" USING btree ("phone");
  CREATE UNIQUE INDEX "venues_website_idx" ON "venues" USING btree ("website");
  CREATE UNIQUE INDEX "venues_instagram_handle_idx" ON "venues" USING btree ("instagram_handle");
  CREATE UNIQUE INDEX "venues_tiktok_handle_idx" ON "venues" USING btree ("tiktok_handle");
  CREATE UNIQUE INDEX "venues_x_handle_idx" ON "venues" USING btree ("x_handle");
  CREATE UNIQUE INDEX "venues_facebook_url_idx" ON "venues" USING btree ("facebook_url");
  CREATE UNIQUE INDEX "venues_linktree_url_idx" ON "venues" USING btree ("linktree_url");
  CREATE UNIQUE INDEX "venues_linked_in_url_idx" ON "venues" USING btree ("linked_in_url");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX "venues_phone_idx";
  DROP INDEX "venues_website_idx";
  DROP INDEX "venues_instagram_handle_idx";
  DROP INDEX "venues_tiktok_handle_idx";
  DROP INDEX "venues_x_handle_idx";
  DROP INDEX "venues_facebook_url_idx";
  DROP INDEX "venues_linktree_url_idx";
  DROP INDEX "venues_linked_in_url_idx";
  ALTER TABLE "venues" DROP COLUMN "phone";
  ALTER TABLE "venues" DROP COLUMN "website";
  ALTER TABLE "venues" DROP COLUMN "instagram_handle";
  ALTER TABLE "venues" DROP COLUMN "tiktok_handle";
  ALTER TABLE "venues" DROP COLUMN "x_handle";
  ALTER TABLE "venues" DROP COLUMN "facebook_url";
  ALTER TABLE "venues" DROP COLUMN "linktree_url";
  ALTER TABLE "venues" DROP COLUMN "linked_in_url";`)
}
