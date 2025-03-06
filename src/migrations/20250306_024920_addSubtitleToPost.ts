import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "sub_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_sub_title" varchar;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "sub_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_sub_title";`)
}
