import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "cms_users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"email" text NOT NULL,
  	"email_verified" timestamp,
  	"image" text,
  	"first_name" text,
  	"last_name" text,
  	"password" text,
  	"created_at" timestamp DEFAULT now() NOT NULL,
  	"updated_at" timestamp DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "accounts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"cms_user_id" uuid NOT NULL,
  	"type" text NOT NULL,
  	"provider" text NOT NULL,
  	"provider_account_id" text NOT NULL,
  	"refresh_token" text,
  	"access_token" text,
  	"expires_at" integer,
  	"token_type" text,
  	"scope" text,
  	"id_token" text,
  	"session_state" text,
  	"created_at" timestamp DEFAULT now() NOT NULL,
  	"updated_at" timestamp DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "authenticators" (
  	"credential_id" text NOT NULL,
  	"cms_user_id" uuid NOT NULL,
  	"provider_account_id" text NOT NULL,
  	"credential_public_key" text NOT NULL,
  	"counter" integer NOT NULL,
  	"credential_device_type" text NOT NULL,
  	"credential_backed_up" boolean NOT NULL,
  	"transports" text,
  	"created_at" timestamp DEFAULT now() NOT NULL,
  	"updated_at" timestamp DEFAULT now() NOT NULL,
  	CONSTRAINT "authenticators_credential_id_unique" UNIQUE("credential_id")
  );
  
  CREATE TABLE IF NOT EXISTS "sessions" (
  	"session_token" text PRIMARY KEY NOT NULL,
  	"cms_user_id" uuid NOT NULL,
  	"expires" timestamp NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "verification_tokens" (
  	"identifier" text NOT NULL,
  	"token" text NOT NULL,
  	"expires" timestamp NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "accounts" ADD CONSTRAINT "accounts_cms_user_id_cms_users_id_fk" FOREIGN KEY ("cms_user_id") REFERENCES "public"."cms_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_cms_user_id_cms_users_id_fk" FOREIGN KEY ("cms_user_id") REFERENCES "public"."cms_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sessions" ADD CONSTRAINT "sessions_cms_user_id_cms_users_id_fk" FOREIGN KEY ("cms_user_id") REFERENCES "public"."cms_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "cms_users_email_indx" ON "cms_users" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_and_provider_account_id_uniq_indx" ON "accounts" USING btree ("provider","provider_account_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "authenticator_user_and_credential_uniq_indx" ON "authenticators" USING btree ("cms_user_id","credential_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_identifier_and_token_uniq_indx" ON "verification_tokens" USING btree ("identifier","token");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms_users" CASCADE;
  DROP TABLE "accounts" CASCADE;
  DROP TABLE "authenticators" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "verification_tokens" CASCADE;`)
}
