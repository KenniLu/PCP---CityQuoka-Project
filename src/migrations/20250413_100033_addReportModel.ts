import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_report" AS ENUM('PostsAuditReport');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED');
  CREATE TABLE IF NOT EXISTS "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"report" "enum_reports_report" NOT NULL,
  	"requested_at" timestamp(3) with time zone,
  	"requestor_id" integer,
  	"status" "enum_reports_status",
  	"errors" jsonb,
  	"filename" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_requestor_id_users_id_fk" FOREIGN KEY ("requestor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reports_requestor_idx" ON "reports" USING btree ("requestor_id");
  CREATE INDEX IF NOT EXISTS "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reports_created_at_idx" ON "reports" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_reports_id_idx";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "reports_id";
  DROP TYPE "public"."enum_reports_report";
  DROP TYPE "public"."enum_reports_status";`)
}
