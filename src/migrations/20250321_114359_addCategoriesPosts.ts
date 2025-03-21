import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "categories_posts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"category_id" integer NOT NULL,
  	"post_id" integer NOT NULL,
  	"category_path" text NOT NULL,
  	"is_featured" boolean,
  	"is_recommended" boolean,
  	"standalone" boolean,
  	"created_at" timestamp DEFAULT now() NOT NULL,
  	"updated_at" timestamp DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  ALTER TABLE "posts" ADD COLUMN "standalone" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_standalone" boolean DEFAULT false;
  ALTER TABLE "categories" ADD COLUMN "slug" varchar;
  ALTER TABLE "categories" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "header_nav_items" ADD COLUMN "icon" varchar;
  DO $$ BEGIN
   ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "categories_posts_category_idx" ON "categories_posts" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "categories_posts_post_idx" ON "categories_posts" USING btree ("post_id");
  CREATE INDEX IF NOT EXISTS "categories_posts_category_path_idx" ON "categories_posts" USING btree ("category_path");
  CREATE INDEX IF NOT EXISTS "categories_posts_featured_idx" ON "categories_posts" USING btree ("is_featured");
  CREATE INDEX IF NOT EXISTS "categories_posts_recommended_idx" ON "categories_posts" USING btree ("is_recommended");
  CREATE INDEX IF NOT EXISTS "categories_posts_standalone_idx" ON "categories_posts" USING btree ("standalone");
  CREATE INDEX IF NOT EXISTS "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "categories_rels_categories_id_idx" ON "categories_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "categories_posts" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP INDEX IF EXISTS "categories_slug_idx";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "standalone";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_standalone";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "icon";`)
}
