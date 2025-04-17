import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DROP CONSTRAINT "reports_requestor_id_users_id_fk";
  
  DROP INDEX IF EXISTS "reports_requestor_idx";
  ALTER TABLE "reports" ADD COLUMN "requestor_name" varchar;
  ALTER TABLE "reports" DROP COLUMN IF EXISTS "requestor_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" ADD COLUMN "requestor_id" integer;
  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_requestor_id_users_id_fk" FOREIGN KEY ("requestor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reports_requestor_idx" ON "reports" USING btree ("requestor_id");
  ALTER TABLE "reports" DROP COLUMN IF EXISTS "requestor_name";`)
}
