-- Ручное применение src/migrations/20260924_120000_media_image_sizes.ts
-- (`npx payload migrate` виснет на инициализации адаптера, см. src/migrations/README.md).
-- ВАЖНО: применять ДО пересборки контейнера с новым кодом, иначе запросы к media упадут.
-- На проде:
--   docker compose -f Docker-compose.yml exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < scripts/manual-migrate-media-image-sizes.sql

BEGIN;

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
  CREATE INDEX IF NOT EXISTS "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");

INSERT INTO "payload_migrations" ("name", "batch")
VALUES ('20260924_120000_media_image_sizes', (SELECT COALESCE(MAX(batch), 0) + 1 FROM "payload_migrations"));

COMMIT;
