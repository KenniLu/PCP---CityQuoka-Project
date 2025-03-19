import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."reaction_types" AS ENUM('save', 'like');
  CREATE TABLE IF NOT EXISTS "cms_user_reactions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"cms_user_id" uuid NOT NULL,
  	"post_id" integer NOT NULL,
  	"reaction" "reaction_types" NOT NULL,
  	"created_at" timestamp DEFAULT now() NOT NULL,
  	"updated_at" timestamp DEFAULT now() NOT NULL
  );
  
  CREATE UNIQUE INDEX IF NOT EXISTS "reactions_user_article_index" ON "cms_user_reactions" USING btree ("cms_user_id","post_id","reaction");
  CREATE INDEX IF NOT EXISTS "reactions_user_idx" ON "cms_user_reactions" USING btree ("cms_user_id");
  CREATE INDEX IF NOT EXISTS "reactions_post_idx" ON "cms_user_reactions" USING btree ("post_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms_user_reactions" CASCADE;
  DROP TYPE "public"."reaction_types";`)
}
