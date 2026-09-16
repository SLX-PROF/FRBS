import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// SP3 — задачи: у `activities` появляются исполнитель и приоритет.
// Идемпотентная дельта.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_activities_priority" AS ENUM('low', 'normal', 'high'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "assignee_id" integer;
  ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "priority" "enum_activities_priority" DEFAULT 'normal';
  DO $$ BEGIN ALTER TABLE "activities" ADD CONSTRAINT "activities_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "activities_assignee_idx" ON "activities" USING btree ("assignee_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "activities" DROP COLUMN IF EXISTS "assignee_id";
  ALTER TABLE "activities" DROP COLUMN IF EXISTS "priority";
  DROP TYPE IF EXISTS "public"."enum_activities_priority";`)
}
