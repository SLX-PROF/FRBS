import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// SP1 (152-ФЗ baseline) + SP2 (CRM pipeline).
// Idempotent delta: база собрана ранее через `push`, поэтому добавляем только
// новое (IF NOT EXISTS / EXCEPTION WHEN duplicate_object). Безопасно
// перезапускать.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'manager'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_leads_source" AS ENUM('site', 'chatbot', 'manual', '1c'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_companies_kind" AS ENUM('dealer', 'architect', 'developer', 'installer', 'endCustomer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_companies_source" AS ENUM('site', 'chatbot', 'manual', '1c'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_deals_stage" AS ENUM('proposal', 'negotiation', 'won', 'lost'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_deals_source" AS ENUM('site', 'chatbot', 'manual', '1c'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_activities_kind" AS ENUM('call', 'email', 'meeting', 'note'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_audit_log_action" AS ENUM('create', 'update', 'delete'); EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" varchar;
  UPDATE "users" SET "name" = "email" WHERE "name" IS NULL;
  ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'manager' NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "telegram_chat_id" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true;

  CREATE TABLE IF NOT EXISTS "companies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"inn" varchar,
  	"kind" "enum_companies_kind",
  	"city" varchar,
  	"website" varchar,
  	"contact_person" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"notes" varchar,
  	"owner_id" integer,
  	"external_id" varchar,
  	"source" "enum_companies_source" DEFAULT 'manual',
  	"synced_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "deals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"company_id" integer NOT NULL,
  	"owner_id" integer NOT NULL,
  	"stage" "enum_deals_stage" DEFAULT 'proposal' NOT NULL,
  	"amount" numeric,
  	"expected_close_at" timestamp(3) with time zone,
  	"lost_reason" varchar,
  	"source_lead_id" integer,
  	"notes" varchar,
  	"external_id" varchar,
  	"source" "enum_deals_source" DEFAULT 'manual',
  	"synced_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "deals_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );

  CREATE TABLE IF NOT EXISTS "activities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_activities_kind" DEFAULT 'note' NOT NULL,
  	"subject" varchar NOT NULL,
  	"body" varchar,
  	"deal_id" integer,
  	"lead_id" integer,
  	"author_id" integer,
  	"due_at" timestamp(3) with time zone,
  	"done_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" "enum_audit_log_action",
  	"collection_slug" varchar,
  	"document_id" varchar,
  	"user_id" integer,
  	"changed_fields" jsonb,
  	"at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "leads" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "consent" boolean;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "consent_at" timestamp(3) with time zone;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "policy_version" varchar;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "triage_note" varchar;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "owner_id" integer;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "linked_company_id" integer;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "linked_deal_id" integer;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "external_id" varchar;
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "source" "enum_leads_source" DEFAULT 'site';
  ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "synced_at" timestamp(3) with time zone;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "companies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "deals_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "activities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "audit_log_id" integer;

  DO $$ BEGIN ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "leads" ADD CONSTRAINT "leads_linked_company_id_companies_id_fk" FOREIGN KEY ("linked_company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "leads" ADD CONSTRAINT "leads_linked_deal_id_deals_id_fk" FOREIGN KEY ("linked_deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "deals" ADD CONSTRAINT "deals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "deals" ADD CONSTRAINT "deals_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "deals" ADD CONSTRAINT "deals_source_lead_id_leads_id_fk" FOREIGN KEY ("source_lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "deals_rels" ADD CONSTRAINT "deals_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "deals_rels" ADD CONSTRAINT "deals_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "activities" ADD CONSTRAINT "activities_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "activities" ADD CONSTRAINT "activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "activities" ADD CONSTRAINT "activities_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deals_fk" FOREIGN KEY ("deals_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "leads_owner_idx" ON "leads" USING btree ("owner_id");
  CREATE INDEX IF NOT EXISTS "leads_linked_company_idx" ON "leads" USING btree ("linked_company_id");
  CREATE INDEX IF NOT EXISTS "leads_linked_deal_idx" ON "leads" USING btree ("linked_deal_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "leads_external_id_idx" ON "leads" USING btree ("external_id");
  CREATE INDEX IF NOT EXISTS "companies_owner_idx" ON "companies" USING btree ("owner_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "companies_external_id_idx" ON "companies" USING btree ("external_id");
  CREATE INDEX IF NOT EXISTS "companies_updated_at_idx" ON "companies" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "companies_created_at_idx" ON "companies" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "deals_company_idx" ON "deals" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "deals_owner_idx" ON "deals" USING btree ("owner_id");
  CREATE INDEX IF NOT EXISTS "deals_source_lead_idx" ON "deals" USING btree ("source_lead_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "deals_external_id_idx" ON "deals" USING btree ("external_id");
  CREATE INDEX IF NOT EXISTS "deals_updated_at_idx" ON "deals" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "deals_created_at_idx" ON "deals" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "deals_rels_order_idx" ON "deals_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "deals_rels_parent_idx" ON "deals_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "deals_rels_path_idx" ON "deals_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "deals_rels_products_id_idx" ON "deals_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "activities_deal_idx" ON "activities" USING btree ("deal_id");
  CREATE INDEX IF NOT EXISTS "activities_lead_idx" ON "activities" USING btree ("lead_id");
  CREATE INDEX IF NOT EXISTS "activities_author_idx" ON "activities" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "activities_updated_at_idx" ON "activities" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "activities_created_at_idx" ON "activities" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "audit_log_user_idx" ON "audit_log" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_companies_id_idx" ON "payload_locked_documents_rels" USING btree ("companies_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_deals_id_idx" ON "payload_locked_documents_rels" USING btree ("deals_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("activities_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "deals_rels" CASCADE;
  DROP TABLE IF EXISTS "activities" CASCADE;
  DROP TABLE IF EXISTS "audit_log" CASCADE;
  DROP TABLE IF EXISTS "deals" CASCADE;
  DROP TABLE IF EXISTS "companies" CASCADE;
  ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "companies_id",
    DROP COLUMN IF EXISTS "deals_id",
    DROP COLUMN IF EXISTS "activities_id",
    DROP COLUMN IF EXISTS "audit_log_id";
  ALTER TABLE "leads"
    DROP COLUMN IF EXISTS "consent",
    DROP COLUMN IF EXISTS "consent_at",
    DROP COLUMN IF EXISTS "policy_version",
    DROP COLUMN IF EXISTS "triage_note",
    DROP COLUMN IF EXISTS "owner_id",
    DROP COLUMN IF EXISTS "linked_company_id",
    DROP COLUMN IF EXISTS "linked_deal_id",
    DROP COLUMN IF EXISTS "external_id",
    DROP COLUMN IF EXISTS "source",
    DROP COLUMN IF EXISTS "synced_at";
  ALTER TABLE "users"
    DROP COLUMN IF EXISTS "name",
    DROP COLUMN IF EXISTS "role",
    DROP COLUMN IF EXISTS "telegram_chat_id",
    DROP COLUMN IF EXISTS "active";
  DROP TYPE IF EXISTS "public"."enum_users_role";
  DROP TYPE IF EXISTS "public"."enum_leads_source";
  DROP TYPE IF EXISTS "public"."enum_companies_kind";
  DROP TYPE IF EXISTS "public"."enum_companies_source";
  DROP TYPE IF EXISTS "public"."enum_deals_stage";
  DROP TYPE IF EXISTS "public"."enum_deals_source";
  DROP TYPE IF EXISTS "public"."enum_activities_kind";
  DROP TYPE IF EXISTS "public"."enum_audit_log_action";`)
}
