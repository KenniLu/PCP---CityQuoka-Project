import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_status" AS ENUM('active', 'inactive');
  CREATE TABLE IF NOT EXISTS "locations_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt_text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"address" varchar,
  	"city" varchar,
  	"state_province" varchar,
  	"country" varchar,
  	"postal_code" varchar,
  	"latitude" varchar,
  	"longitude" varchar,
  	"google_place_id" varchar,
  	"phone" varchar,
  	"website" varchar,
  	"status" "enum_locations_status" DEFAULT 'active',
  	"social_links" jsonb,
  	"provider_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "providers" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "locations_id" integer;
  DO $$ BEGIN
   ALTER TABLE "locations_images" ADD CONSTRAINT "locations_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "locations_images" ADD CONSTRAINT "locations_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "locations" ADD CONSTRAINT "locations_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "locations_images_order_idx" ON "locations_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_images_parent_id_idx" ON "locations_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_images_image_idx" ON "locations_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "locations_provider_idx" ON "locations" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "locations_created_at_idx" ON "locations" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "locations_images" CASCADE;
  DROP TABLE "locations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_locations_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_locations_id_idx";
  ALTER TABLE "providers" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "locations_id";
  DROP TYPE "public"."enum_locations_status";`)
}
