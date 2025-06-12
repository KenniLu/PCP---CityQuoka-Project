import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_providers_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_providers_verification_status" AS ENUM('pending', 'verified', 'rejected');
  CREATE TABLE IF NOT EXISTS "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"user_roles_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "providers_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt_text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "providers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"address" varchar,
  	"website" varchar,
  	"logo_id" integer,
  	"social_links" jsonb,
  	"status" "enum_providers_status" DEFAULT 'active',
  	"verification_status" "enum_providers_verification_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "user_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"permissions" jsonb NOT NULL,
  	"provider_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "pages" ADD COLUMN "provider_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_provider_id" integer;
  ALTER TABLE "posts" ADD COLUMN "provider_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_provider_id" integer;
  ALTER TABLE "media" ADD COLUMN "provider_id" integer;
  ALTER TABLE "events" ADD COLUMN "provider_id" integer;
  ALTER TABLE "programmes" ADD COLUMN "provider_id" integer;
  ALTER TABLE "venues" ADD COLUMN "provider_id" integer;
  ALTER TABLE "reports" ADD COLUMN "provider_id" integer;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "providers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "user_roles_id" integer;
  DO $$ BEGIN
   ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_user_roles_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "providers_images" ADD CONSTRAINT "providers_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "providers_images" ADD CONSTRAINT "providers_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "providers" ADD CONSTRAINT "providers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "users_rels_user_roles_id_idx" ON "users_rels" USING btree ("user_roles_id");
  CREATE INDEX IF NOT EXISTS "providers_images_order_idx" ON "providers_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "providers_images_parent_id_idx" ON "providers_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "providers_images_image_idx" ON "providers_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "providers_logo_idx" ON "providers" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "providers_updated_at_idx" ON "providers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "providers_created_at_idx" ON "providers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "user_roles_provider_idx" ON "user_roles" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "user_roles_updated_at_idx" ON "user_roles" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "user_roles_created_at_idx" ON "user_roles" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_provider_id_providers_id_fk" FOREIGN KEY ("version_provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_provider_id_providers_id_fk" FOREIGN KEY ("version_provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "media" ADD CONSTRAINT "media_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "programmes" ADD CONSTRAINT "programmes_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "venues" ADD CONSTRAINT "venues_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_providers_fk" FOREIGN KEY ("providers_id") REFERENCES "public"."providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_roles_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_provider_idx" ON "pages" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_provider_idx" ON "_pages_v" USING btree ("version_provider_id");
  CREATE INDEX IF NOT EXISTS "posts_provider_idx" ON "posts" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_provider_idx" ON "_posts_v" USING btree ("version_provider_id");
  CREATE INDEX IF NOT EXISTS "media_provider_idx" ON "media" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "events_provider_idx" ON "events" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "programmes_provider_idx" ON "programmes" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "venues_provider_idx" ON "venues" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "reports_provider_idx" ON "reports" USING btree ("provider_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_providers_id_idx" ON "payload_locked_documents_rels" USING btree ("providers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_user_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("user_roles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "providers_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "providers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "user_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "providers_images" CASCADE;
  DROP TABLE "providers" CASCADE;
  DROP TABLE "user_roles" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_provider_id_providers_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_provider_id_providers_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_provider_id_providers_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_provider_id_providers_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_provider_id_providers_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_provider_id_providers_id_fk";
  
  ALTER TABLE "programmes" DROP CONSTRAINT "programmes_provider_id_providers_id_fk";
  
  ALTER TABLE "venues" DROP CONSTRAINT "venues_provider_id_providers_id_fk";
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_provider_id_providers_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_providers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_user_roles_fk";
  
  DROP INDEX IF EXISTS "pages_provider_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_provider_idx";
  DROP INDEX IF EXISTS "posts_provider_idx";
  DROP INDEX IF EXISTS "_posts_v_version_version_provider_idx";
  DROP INDEX IF EXISTS "media_provider_idx";
  DROP INDEX IF EXISTS "events_provider_idx";
  DROP INDEX IF EXISTS "programmes_provider_idx";
  DROP INDEX IF EXISTS "venues_provider_idx";
  DROP INDEX IF EXISTS "reports_provider_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_providers_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_user_roles_id_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_provider_id";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_provider_id";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "programmes" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "venues" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "reports" DROP COLUMN IF EXISTS "provider_id";
  ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "providers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "user_roles_id";
  DROP TYPE "public"."enum_providers_status";
  DROP TYPE "public"."enum_providers_verification_status";`)
}
