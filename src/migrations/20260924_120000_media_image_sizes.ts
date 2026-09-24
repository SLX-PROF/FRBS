import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Media получила imageSizes (card 640px и large 1600px, WebP). Payload хранит
// каждый размер в колонках media.sizes_<имя>_*; без них любой запрос к media
// на проде упадёт, поэтому эта миграция обязательна ДО выкладки кода.
// Идемпотентна (IF NOT EXISTS).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media"
    ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_large_url" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_large_width" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_large_height" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_large_mime_type" varchar,
    ADD COLUMN IF NOT EXISTS "sizes_large_filesize" numeric,
    ADD COLUMN IF NOT EXISTS "sizes_large_filename" varchar;
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_large_sizes_large_filename_idx";
  ALTER TABLE "media"
    DROP COLUMN IF EXISTS "sizes_card_url",
    DROP COLUMN IF EXISTS "sizes_card_width",
    DROP COLUMN IF EXISTS "sizes_card_height",
    DROP COLUMN IF EXISTS "sizes_card_mime_type",
    DROP COLUMN IF EXISTS "sizes_card_filesize",
    DROP COLUMN IF EXISTS "sizes_card_filename",
    DROP COLUMN IF EXISTS "sizes_large_url",
    DROP COLUMN IF EXISTS "sizes_large_width",
    DROP COLUMN IF EXISTS "sizes_large_height",
    DROP COLUMN IF EXISTS "sizes_large_mime_type",
    DROP COLUMN IF EXISTS "sizes_large_filesize",
    DROP COLUMN IF EXISTS "sizes_large_filename";`)
}
