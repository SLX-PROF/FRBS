import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Поле Products.images стало галереей (hasMany upload) вместо одиночного фото.
// Payload переносит hasMany-связи в отдельную `<collection>_rels` таблицу
// (по той же схеме, что и `deals_rels` в sp1/sp2) — переносим уже загруженные
// одиночные фото в неё и убираем старую колонку `images_id`.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  ALTER TABLE "products" DROP COLUMN IF EXISTS "images_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "images_id" integer;

  UPDATE "products" p
  SET "images_id" = r."media_id"
  FROM "products_rels" r
  WHERE r."parent_id" = p."id" AND r."path" = 'images' AND r."order" = 1;

  DO $$ BEGIN ALTER TABLE "products" ADD CONSTRAINT "products_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "products_images_idx" ON "products" USING btree ("images_id");

  DROP TABLE IF EXISTS "products_rels" CASCADE;`)
}
