import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "venues" RENAME COLUMN "formatted_address" TO "address";
  ALTER TABLE "venues" DROP COLUMN IF EXISTS "address_line_1";
  ALTER TABLE "venues" DROP COLUMN IF EXISTS "address_line_2";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "venues" ADD COLUMN "address_line_1" varchar;
  ALTER TABLE "venues" ADD COLUMN "address_line_2" varchar;
  ALTER TABLE "venues" ADD COLUMN "formatted_address" varchar;
  ALTER TABLE "venues" DROP COLUMN IF EXISTS "address";`)
}
