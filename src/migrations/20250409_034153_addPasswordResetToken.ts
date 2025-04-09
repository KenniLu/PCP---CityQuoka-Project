import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"cms_user_id" uuid NOT NULL,
  	"token" uuid DEFAULT gen_random_uuid() NOT NULL,
  	"token_expiry" timestamp DEFAULT now() + interval '1 hour' NOT NULL,
  	"created_at" timestamp DEFAULT now() NOT NULL,
  	"updated_at" timestamp DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_cms_user_id_cms_users_id_fk" FOREIGN KEY ("cms_user_id") REFERENCES "public"."cms_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "password_tokens_token_indx" ON "password_reset_tokens" USING btree ("token");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "password_reset_tokens" CASCADE;`)
}
