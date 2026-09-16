import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// SP5 — чат-бот: индекс базы знаний (kb_chunks) и диалоги (chat_sessions).
// Идемпотентная дельта.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "kb_chunks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar,
  	"ref_id" numeric,
  	"ref_slug" varchar,
  	"text" varchar,
  	"embedding" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "chat_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"messages" jsonb,
  	"lead_id" integer,
  	"consent" boolean,
  	"started_at" timestamp(3) with time zone,
  	"last_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "kb_chunks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "chat_sessions_id" integer;

  DO $$ BEGIN ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kb_chunks_fk" FOREIGN KEY ("kb_chunks_id") REFERENCES "public"."kb_chunks"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_sessions_fk" FOREIGN KEY ("chat_sessions_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "kb_chunks_updated_at_idx" ON "kb_chunks" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "kb_chunks_created_at_idx" ON "kb_chunks" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "chat_sessions_lead_idx" ON "chat_sessions" USING btree ("lead_id");
  CREATE INDEX IF NOT EXISTS "chat_sessions_updated_at_idx" ON "chat_sessions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "chat_sessions_created_at_idx" ON "chat_sessions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_kb_chunks_id_idx" ON "payload_locked_documents_rels" USING btree ("kb_chunks_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_chat_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_sessions_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "chat_sessions" CASCADE;
  DROP TABLE IF EXISTS "kb_chunks" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "kb_chunks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "chat_sessions_id";`)
}
