import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// SP5 hardening — непредсказуемый токен сессии чат-бота (числовой id
// перечислим, по нему нельзя разрешать запись в чужую сессию).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "chat_sessions" ADD COLUMN IF NOT EXISTS "token" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "chat_sessions_token_idx" ON "chat_sessions" USING btree ("token");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "chat_sessions_token_idx";
  ALTER TABLE "chat_sessions" DROP COLUMN IF EXISTS "token";`)
}
