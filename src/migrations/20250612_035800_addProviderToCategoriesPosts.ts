import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories_posts" ADD COLUMN "provider_id" integer;
  CREATE INDEX IF NOT EXISTS "categories_posts_provider_id_idx" ON "categories_posts" USING btree ("provider_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "categories_posts_provider_id_idx";
  ALTER TABLE "categories_posts" DROP COLUMN IF EXISTS "provider_id";`)
}
