-- Ручное применение src/migrations/20260917_140000_products_images_gallery.ts
-- Нужно, потому что `npx payload migrate` виснет на инициализации адаптера
-- при push: true (известная проблема, см. src/migrations/README.md).
-- Применять на живой прод-БД так:
--   docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < scripts/manual-migrate-products-images-gallery.sql

BEGIN;

CREATE TABLE IF NOT EXISTS "products_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

DO $$ BEGIN ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "products_rels_order_idx" ON "products_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "products_rels_path_idx" ON "products_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");

INSERT INTO "products_rels" ("parent_id", "path", "order", "media_id")
SELECT "id", 'images', 1, "images_id" FROM "products" WHERE "images_id" IS NOT NULL;

ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_images_id_media_id_fk";
DROP INDEX IF EXISTS "products_images_idx";
ALTER TABLE "products" DROP COLUMN IF EXISTS "images_id";

INSERT INTO "payload_migrations" ("name", "batch")
VALUES ('20260917_140000_products_images_gallery', (SELECT COALESCE(MAX(batch), 0) + 1 FROM "payload_migrations"));

COMMIT;
